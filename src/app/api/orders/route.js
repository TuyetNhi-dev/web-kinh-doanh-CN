import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotification } from "@/lib/notifications";
import { sendEmail, buildOrderConfirmEmail } from "@/lib/email";

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

    // Lấy user_id
    const [userRows] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [session.user.email]
    );
    const userId = userRows[0]?.id ?? null;

    // Tạo đơn hàng
    const [orderResult] = await connection.execute(
      `INSERT INTO orders
         (user_id, total_amount, status, customer_name, customer_email,
          shipping_name, shipping_phone, shipping_address, payment_method)
       VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        totalAmount,
        shippingInfo?.fullName  || "",
        session.user.email,
        shippingInfo?.fullName  || "",
        shippingInfo?.phone     || "",
        shippingInfo?.address   || "",
        shippingInfo?.paymentMethod || "cod",
      ]
    );
    const orderId = orderResult.insertId;

    // Lưu order_items và trừ tồn kho
    for (const item of items) {
      const [productRows] = await connection.execute(
        "SELECT stock_quantity FROM products WHERE id = ?",
        [item.id]
      );

      if (productRows.length === 0) throw new Error(`Sản phẩm không tồn tại: ${item.id}`);

      const stock = productRows[0].stock_quantity ?? 0;
      if (stock < item.quantity) {
        throw new Error(`Sản phẩm "${item.name || item.id}" không đủ tồn kho`);
      }

      await connection.execute(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );

      await connection.execute(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
        [item.quantity, item.id]
      );
    }

    // Tạo thông báo trong DB
    if (userId) {
      await createNotification(connection, {
        userId,
        type:    "order",
        title:   `Đơn hàng #${orderId} đã được đặt thành công`,
        content: `Tổng tiền: ${parseFloat(totalAmount).toLocaleString("vi-VN")} đ. Chúng tôi sẽ liên hệ sớm để xác nhận giao hàng.`,
      });
    }

    await connection.commit();

    // Gửi email xác nhận (không block response nếu lỗi)
    sendEmail({
      to:      session.user.email,
      subject: `Xác nhận đơn hàng #${orderId} — HBN TechStore`,
      html:    buildOrderConfirmEmail({
        orderId,
        customerName: shippingInfo?.fullName || session.user.name || "Khách hàng",
        totalAmount,
        items,
      }),
    }).catch((err) => console.error("Lỗi gửi email xác nhận đơn hàng:", err));

    return NextResponse.json(
      { message: "Đặt hàng thành công!", orderId },
      { status: 201 }
    );
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Lỗi đặt hàng:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi server khi xử lý đơn hàng." },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
