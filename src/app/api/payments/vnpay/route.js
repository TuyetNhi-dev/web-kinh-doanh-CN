import { NextResponse } from "next/server";
import { createPaymentUrl } from "@/lib/vnpay";
import { getConnection } from "@/lib/db";
import { headers } from "next/headers";

/**
 * POST /api/payments/vnpay
 * Creates a real VNPay Sandbox payment URL.
 * Body: { orderId, amount, orderInfo }
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

    // Security: verify the order actually exists and belongs to a real user
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

    const order = orderRows[0];

    // Double-check amount integrity (prevent tampering)
    const dbAmount = Math.round(parseFloat(order.total_amount));
    const reqAmount = Math.round(parseFloat(amount));
    if (dbAmount !== reqAmount) {
      console.warn(`[VNPay] Amount mismatch for order ${orderId}: DB=${dbAmount}, Request=${reqAmount}`);
      return NextResponse.json(
        { message: "Số tiền không hợp lệ" },
        { status: 400 }
      );
    }

    // Get client IP
    const headersList = headers();
    const ipAddr =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "127.0.0.1";

    // Create initial payment record with 'pending' status
    await connection.execute(
      `INSERT INTO payments (order_id, amount, method, status, created_at)
       VALUES (?, ?, 'vnpay', 'pending', NOW())
       ON DUPLICATE KEY UPDATE status = 'pending', created_at = NOW()`,
      [orderId, reqAmount]
    );

    // Build real VNPay URL with HMAC-SHA512
    console.log("=== VNPAY DEBUG ===");
    console.log("TMN:", process.env.VNP_TMNCODE);
    console.log("RETURN URL:", process.env.VNP_RETURNURL);

    const paymentUrl = createPaymentUrl({
      orderId,
      amount: reqAmount,
      orderInfo: orderInfo || `Thanh toan don hang #${orderId}`,
      ipAddr,
      locale: "vn",
    });

    console.log("PAYMENT URL:", paymentUrl);
    return NextResponse.json({ paymentUrl });
  } catch (error) {
    console.error("[VNPay] Create payment URL error:", error);
    return NextResponse.json(
      { message: "Không thể tạo link thanh toán VNPay. Vui lòng thử lại." },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
