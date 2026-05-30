import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { verifyMoMoCallback, getMoMoResponseMessage } from "@/lib/momo";
import { createNotification } from "@/lib/notifications";
import { sendEmail, buildOrderConfirmEmail } from "@/lib/email";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Shared handler: update DB based on a verified MoMo callback.
 * Used by both the browser redirect (GET) and the IPN (POST).
 */
async function processMoMoResult(params) {
  const { orderId, resultCode, transId, amount } = params;

  const isSuccess    = Number(resultCode) === 0;
  const orderStatus  = isSuccess ? "processing" : "cancelled";
  const paymentStatus = isSuccess ? "paid" : "failed";
  const responseMsg  = getMoMoResponseMessage(resultCode);

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    const [orderRows] = await connection.execute(
      "SELECT id, total_amount, user_id, customer_email, shipping_name FROM orders WHERE id = ?",
      [orderId]
    );

    if (orderRows.length === 0) {
      await connection.rollback();
      return { ok: false, error: "order_not_found" };
    }

    const dbAmount  = Math.round(parseFloat(orderRows[0].total_amount));
    const cbAmount  = Math.round(parseFloat(amount));

    if (dbAmount !== cbAmount) {
      console.error(`[MoMo Callback] Amount mismatch: DB=${dbAmount}, Callback=${cbAmount}`);
      await connection.rollback();
      return { ok: false, error: "amount_mismatch" };
    }

    const paymentInfo = JSON.stringify({
      method:      "momo",
      status:      paymentStatus,
      transId,
      resultCode,
      responseMsg,
    });

    await connection.execute(
      "UPDATE orders SET status = ?, payment_info = ? WHERE id = ?",
      [orderStatus, paymentInfo, orderId]
    );

    await connection.execute(
      `INSERT INTO payments
         (order_id, amount, method, status, transaction_id, raw_data, created_at)
       VALUES (?, ?, 'momo', ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         status         = VALUES(status),
         transaction_id = VALUES(transaction_id),
         raw_data       = VALUES(raw_data)`,
      [orderId, cbAmount, paymentStatus, transId || null, JSON.stringify(params)]
    );

    // Gửi notification + email sau khi thanh toán thành công
    if (isSuccess) {
      const { user_id: userId, customer_email: email, shipping_name: name } = orderRows[0];
      const totalFormatted = parseFloat(orderRows[0].total_amount).toLocaleString("vi-VN");
      if (userId) {
        await createNotification(connection, {
          userId,
          type:    "order",
          title:   `Đơn hàng #${orderId} đã được đặt thành công`,
          content: `Tổng tiền: ${totalFormatted} đ. Thanh toán MoMo thành công. Chúng tôi sẽ sớm giao hàng.`,
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
          html: buildOrderConfirmEmail({ orderId, customerName: name || "Khách hàng", totalAmount: orderRows[0].total_amount, items: itemRows }),
        }).catch(err => console.error("[MoMo] Lỗi gửi email:", err));
      }
    }

    await connection.commit();
    return { ok: true, isSuccess, orderId, transId };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

/**
 * GET /api/payments/momo/callback
 * MoMo redirects the user's browser here after payment.
 * Query params include resultCode, orderId, transId, signature, etc.
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const params = {};
  searchParams.forEach((value, key) => { params[key] = value; });

  // Verify signature to prevent forged redirects
  if (!verifyMoMoCallback(params)) {
    console.error("[MoMo Callback GET] Invalid signature", params);
    return NextResponse.redirect(`${BASE_URL}/order-success?momo=fail&error=signature_invalid`);
  }

  try {
    const result = await processMoMoResult(params);

    if (!result.ok) {
      return NextResponse.redirect(
        `${BASE_URL}/order-success?orderId=${params.orderId}&momo=fail&error=${result.error}`
      );
    }

    if (result.isSuccess) {
      return NextResponse.redirect(
        `${BASE_URL}/order-success?orderId=${result.orderId}&momo=success&transId=${result.transId}`
      );
    }
    return NextResponse.redirect(
      `${BASE_URL}/order-success?orderId=${result.orderId}&momo=fail&code=${params.resultCode}`
    );
  } catch (error) {
    console.error("[MoMo Callback GET] Error:", error);
    return NextResponse.redirect(`${BASE_URL}/order-success?momo=fail&error=server_error`);
  }
}

/**
 * POST /api/payments/momo/callback
 * MoMo IPN: server-to-server notification, sent asynchronously.
 * Must return HTTP 204 to acknowledge receipt.
 */
export async function POST(req) {
  let params;
  try {
    params = await req.json();
  } catch {
    return new Response(null, { status: 400 });
  }

  if (!verifyMoMoCallback(params)) {
    console.error("[MoMo IPN] Invalid signature", params);
    return new Response(null, { status: 400 });
  }

  try {
    await processMoMoResult(params);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("[MoMo IPN] Error:", error);
    return new Response(null, { status: 500 });
  }
}
