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

<<<<<<< HEAD
    // 2. Lưu vào bảng order_items và trừ tồn kho
    for (const item of items) {
      const [productRows] = await connection.execute(
        "SELECT stock_quantity FROM products WHERE id = ?",
        [item.id]
      );

      if (productRows.length === 0) {
        throw new Error(`Sản phẩm không tồn tại: ${item.id}`);
      }

      const stockQuantity = productRows[0].stock_quantity || 0;
      if (stockQuantity < item.quantity) {
        throw new Error(`Sản phẩm ${item.name || item.id} không đủ tồn kho`);
      }

=======
    // 2. Lưu vào bảng order_items
    for (const item of items) {
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );
<<<<<<< HEAD

      await connection.execute(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
        [item.quantity, item.id]
      );
=======
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
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
