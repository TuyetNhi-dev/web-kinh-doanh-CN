import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  let connection;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
    }

    const { items, totalAmount, shippingInfo } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ message: "Giỏ hàng trống." }, { status: 400 });
    }

    connection = await getConnection();
    await connection.beginTransaction();

    // 1. Lưu vào bảng orders
    const [orderResult] = await connection.execute(
      "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)",
      [session.user.id || null, totalAmount, "pending"]
    );
    const orderId = orderResult.insertId;

    // 2. Lưu vào bảng order_items
    for (const item of items) {
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await connection.commit();

    return NextResponse.json(
      { message: "Đặt hàng thành công!", orderId },
      { status: 201 }
    );
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Lỗi đặt hàng:", error);
    return NextResponse.json(
      { message: "Lỗi server khi xử lý đơn hàng." },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
