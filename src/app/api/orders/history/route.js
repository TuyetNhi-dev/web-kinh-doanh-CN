export const dynamic = 'force-dynamic';
import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  let connection;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
    }

    connection = await getConnection();

    // Get user ID from email
    const [users] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [session.user.email]
    );

    if (users.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy user." }, { status: 404 });
    }

    const userId = users[0].id;

    // Get orders with items
    const [orders] = await connection.execute(
      `SELECT o.id, o.total_amount, o.status, o.created_at, o.shipping_name, o.shipping_phone, o.shipping_address, o.payment_method
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    // For each order, get order items with product info
    for (const order of orders) {
      const [items] = await connection.execute(
        `SELECT oi.quantity, oi.price, p.name, p.image_url
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Lỗi lấy lịch sử đơn hàng:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
