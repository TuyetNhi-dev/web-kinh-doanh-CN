import { NextResponse } from "next/server";
import { verifyReturnUrl, getResponseMessage } from "@/lib/vnpay";
import { getConnection } from "@/lib/db";
import { createNotification } from "@/lib/notifications";
import { sendEmail, buildOrderConfirmEmail } from "@/lib/email";

/**
 * GET /api/vnpay_return
 *
 * VNPay redirects the user back to this URL after payment.
 * This handler:
 *   1. Verifies the HMAC-SHA512 signature to prevent tampering
 *   2. Extracts the order ID from vnp_TxnRef
 *   3. Updates orders.status and inserts/updates payments table
 *   4. Redirects user to /order-success with appropriate params
 *
 * VNPay Spec: vnp_TxnRef format is "orderId-timestamp" (set in createPaymentUrl)
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  // Convert URLSearchParams to a plain object
  const params = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  let connection;
  try {
    // ── Step 1: Verify HMAC-SHA512 signature ─────────────────────────────────
    const result = verifyReturnUrl(params);

    if (!result.valid) {
      console.error("[VNPay Return] Invalid signature detected!", params);
      // Redirect to failure page — do NOT update DB on invalid signature
      return NextResponse.redirect(
        `${BASE_URL}/order-success?vnpay=fail&error=signature_invalid`
      );
    }

    // ── Step 2: Extract orderId from txnRef ("orderId-timestamp") ────────────
    const txnRef  = result.txnRef; // e.g. "42-1748254800000"
    const orderId = parseInt(txnRef.split("-")[0], 10);

    if (!orderId || isNaN(orderId)) {
      console.error("[VNPay Return] Cannot parse orderId from txnRef:", txnRef);
      return NextResponse.redirect(
        `${BASE_URL}/order-success?vnpay=fail&error=invalid_ref`
      );
    }

    // ── Step 3: Connect to DB ─────────────────────────────────────────────────
    connection = await getConnection();
    await connection.beginTransaction();

    // Fetch order to validate amount (anti-tampering)
    const [orderRows] = await connection.execute(
      "SELECT id, total_amount, status, user_id, customer_email, shipping_name FROM orders WHERE id = ?",
      [orderId]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return NextResponse.redirect(
        `${BASE_URL}/order-success?orderId=${orderId}&vnpay=fail&error=order_not_found`
      );
    }

    const order    = orderRows[0];
    const dbAmount = Math.round(parseFloat(order.total_amount));
    const vnpAmount = result.amount; // Already divided by 100 in verifyReturnUrl

    // Prevent replay / amount tampering
    if (dbAmount !== Math.round(vnpAmount)) {
      console.error(`[VNPay Return] Amount mismatch: DB=${dbAmount}, VNPay=${vnpAmount}`);
      await connection.rollback();
      return NextResponse.redirect(
        `${BASE_URL}/order-success?orderId=${orderId}&vnpay=fail&error=amount_mismatch`
      );
    }

    const isSuccess    = result.responseCode === "00";
    const orderStatus  = isSuccess ? "processing" : "cancelled";
    const paymentStatus = isSuccess ? "paid" : "failed";
    const responseMsg  = getResponseMessage(result.responseCode);

    // ── Step 4: Update order status ───────────────────────────────────────────
    const paymentInfo = JSON.stringify({
      method:        "vnpay",
      status:        paymentStatus,
      transId:       result.transactionId,
      bankCode:      result.bankCode,
      responseCode:  result.responseCode,
      responseMsg,
      payDate:       result.payDate,
      txnRef,
    });

    await connection.execute(
      "UPDATE orders SET status = ?, payment_info = ? WHERE id = ?",
      [orderStatus, paymentInfo, orderId]
    );

    // ── Step 5: Insert / update payments record ───────────────────────────────
    await connection.execute(
      `INSERT INTO payments
         (order_id, amount, method, status, transaction_id, bank_code,
          pay_date, response_code, secure_hash, raw_data, created_at)
       VALUES (?, ?, 'vnpay', ?, ?, ?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         status         = VALUES(status),
         transaction_id = VALUES(transaction_id),
         bank_code      = VALUES(bank_code),
         pay_date       = VALUES(pay_date),
         response_code  = VALUES(response_code),
         secure_hash    = VALUES(secure_hash),
         raw_data       = VALUES(raw_data)`,
      [
        orderId,
        vnpAmount,
        paymentStatus,
        result.transactionId || null,
        result.bankCode       || null,
        result.payDate        || null,
        result.responseCode   || null,
        params.vnp_SecureHash || null,
        JSON.stringify(params),
      ]
    );

    // ── Step 6: Notification + email sau thanh toán thành công ───────────────
    if (isSuccess) {
      const { user_id: userId, customer_email: email, shipping_name: name } = order;
      const totalFormatted = parseFloat(order.total_amount).toLocaleString("vi-VN");
      if (userId) {
        await createNotification(connection, {
          userId,
          type:    "order",
          title:   `Đơn hàng #${orderId} đã được đặt thành công`,
          content: `Tổng tiền: ${totalFormatted} đ. Thanh toán VNPay thành công. Chúng tôi sẽ sớm giao hàng.`,
        });
      }
      if (email) {
        const [itemRows] = await connection.execute(
          `SELECT oi.quantity, oi.price, p.name FROM order_items oi
           JOIN products p ON p.id = oi.product_id WHERE oi.order_id = ?`,
          [orderId]
        );
        sendEmail({
          to: email,
          subject: `Xác nhận đơn hàng #${orderId} — HBN TechStore`,
          html: buildOrderConfirmEmail({ orderId, customerName: name || "Khách hàng", totalAmount: order.total_amount, items: itemRows }),
        }).catch(err => console.error("[VNPay] Lỗi gửi email:", err));
      }
    }

    await connection.commit();

    // ── Step 7: Redirect user to result page ──────────────────────────────────
    if (isSuccess) {
      return NextResponse.redirect(
        `${BASE_URL}/order-success?orderId=${orderId}&vnpay=success&transId=${result.transactionId}&bankCode=${result.bankCode}&amount=${vnpAmount}`
      );
    } else {
      return NextResponse.redirect(
        `${BASE_URL}/order-success?orderId=${orderId}&vnpay=fail&code=${result.responseCode}&amount=${vnpAmount}`
      );
    }
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("[VNPay Return] Unexpected error:", error);
    return NextResponse.redirect(
      `${BASE_URL}/order-success?vnpay=fail&error=server_error`
    );
  } finally {
    if (connection) connection.release();
  }
}
