import { NextResponse } from "next/server";
import { verifyReturnUrl, getResponseMessage } from "@/lib/vnpay";
import { getConnection } from "@/lib/db";

/**
 * GET /api/payments/vnpay/callback
 * VNPay IPN (Instant Payment Notification) — server-to-server notification.
 *
 * VNPay calls this URL asynchronously after payment to confirm the result.
 * Configure this URL in the VNPay merchant portal as the IPN URL.
 *
 * Must respond with JSON { RspCode, Message } to acknowledge receipt.
 * VNPay retries until it receives RspCode "00".
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const params = {};
  searchParams.forEach((value, key) => { params[key] = value; });

  // Step 1: Verify HMAC-SHA512 signature
  const result = verifyReturnUrl(params);
  if (!result.valid) {
    console.error("[VNPay IPN] Invalid signature", params);
    return NextResponse.json({ RspCode: "97", Message: "Invalid Signature" });
  }

  // Step 2: Parse orderId from txnRef ("orderId-timestamp")
  const txnRef  = result.txnRef;
  const orderId = parseInt(txnRef.split("-")[0], 10);
  if (!orderId || isNaN(orderId)) {
    return NextResponse.json({ RspCode: "01", Message: "Order Not Found" });
  }

  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();

    const [orderRows] = await connection.execute(
      "SELECT id, total_amount, status FROM orders WHERE id = ?",
      [orderId]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return NextResponse.json({ RspCode: "01", Message: "Order Not Found" });
    }

    // Step 3: Validate amount (anti-tampering)
    const dbAmount  = Math.round(parseFloat(orderRows[0].total_amount));
    const vnpAmount = Math.round(result.amount);
    if (dbAmount !== vnpAmount) {
      console.error(`[VNPay IPN] Amount mismatch: DB=${dbAmount}, VNPay=${vnpAmount}`);
      await connection.rollback();
      return NextResponse.json({ RspCode: "04", Message: "Invalid Amount" });
    }

    // Step 4: Idempotency — skip if already processed
    const [existingPayments] = await connection.execute(
      "SELECT id, status FROM payments WHERE order_id = ? AND method = 'vnpay'",
      [orderId]
    );
    if (existingPayments.length > 0 && existingPayments[0].status === "paid") {
      await connection.rollback();
      return NextResponse.json({ RspCode: "02", Message: "Order Already Confirmed" });
    }

    // Step 5: Update DB
    const isSuccess    = result.responseCode === "00";
    const orderStatus  = isSuccess ? "processing" : "cancelled";
    const paymentStatus = isSuccess ? "paid" : "failed";
    const responseMsg  = getResponseMessage(result.responseCode);

    const paymentInfo = JSON.stringify({
      method:       "vnpay",
      status:       paymentStatus,
      transId:      result.transactionId,
      bankCode:     result.bankCode,
      responseCode: result.responseCode,
      responseMsg,
      payDate:      result.payDate,
      txnRef,
    });

    await connection.execute(
      "UPDATE orders SET status = ?, payment_info = ? WHERE id = ?",
      [orderStatus, paymentInfo, orderId]
    );

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

    await connection.commit();
    return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("[VNPay IPN] DB error:", err);
    return NextResponse.json({ RspCode: "99", Message: "Unknown Error" });
  } finally {
    if (connection) connection.release();
  }
}
