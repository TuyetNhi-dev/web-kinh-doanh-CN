import { NextResponse } from "next/server";
import { createMoMoPayment } from "@/lib/momo";
import { getConnection } from "@/lib/db";

/**
 * POST /api/payments/momo
 * Creates a real MoMo Sandbox payment request.
 * Body: { orderId, amount, orderInfo? }
 *
 * Returns: { payUrl } — the MoMo-hosted payment page URL.
 */
export async function POST(req) {
  let connection;
  try {
    const { orderId, amount, orderInfo } = await req.json();

    if (!orderId || !amount) {
      return NextResponse.json(
        { message: "Thiếu thông tin đơn hàng hoặc số tiền" },
        { status: 400 }
      );
    }

    // Verify the order exists and the amount matches (anti-tampering)
    connection = await getConnection();
    const [orderRows] = await connection.execute(
      "SELECT id, total_amount, status FROM orders WHERE id = ?",
      [orderId]
    );

    if (orderRows.length === 0) {
      return NextResponse.json(
        { message: "Đơn hàng không tồn tại" },
        { status: 404 }
      );
    }

    const dbAmount  = Math.round(parseFloat(orderRows[0].total_amount));
    const reqAmount = Math.round(parseFloat(amount));

    if (dbAmount !== reqAmount) {
      console.warn(`[MoMo] Amount mismatch for order ${orderId}: DB=${dbAmount}, Request=${reqAmount}`);
      return NextResponse.json(
        { message: "Số tiền không hợp lệ" },
        { status: 400 }
      );
    }

    // Create a pending payment record so we can match on callback
    await connection.execute(
      `INSERT INTO payments (order_id, amount, method, status, created_at)
       VALUES (?, ?, 'momo', 'pending', NOW())
       ON DUPLICATE KEY UPDATE status = 'pending', created_at = NOW()`,
      [orderId, reqAmount]
    );

    // Call the real MoMo Sandbox API
    const momoResponse = await createMoMoPayment({
      orderId,
      amount:    reqAmount,
      orderInfo: orderInfo || `Thanh toan don hang #${orderId}`,
    });

    // MoMo returns resultCode === 0 for success
    if (momoResponse.resultCode !== 0) {
      console.error("[MoMo] Create payment error:", momoResponse);
      return NextResponse.json(
        { message: momoResponse.message || "Không thể tạo link thanh toán MoMo." },
        { status: 502 }
      );
    }

    return NextResponse.json({ payUrl: momoResponse.payUrl });
  } catch (error) {
    console.error("[MoMo] Create payment URL error:", error);
    return NextResponse.json(
      { message: "Không thể tạo link thanh toán MoMo. Vui lòng thử lại." },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
