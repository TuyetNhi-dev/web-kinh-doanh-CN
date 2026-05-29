import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req, { params }) {
  let connection;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
    }

    const { id } = params;
    connection = await getConnection();

    const [rows] = await connection.execute(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy đơn hàng." }, { status: 404 });
    }

    const order = rows[0];

    const [itemsRows] = await connection.execute(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [id]
    );
    
    order.items = itemsRows;

    // Kiểm tra quyền truy cập (chỉ người đặt hoặc admin mới xem được)
    const isAdmin = session.user.role === "admin";
    if (!isAdmin && order.customer_email !== session.user.email) {
      return NextResponse.json(
        { message: "Không có quyền xem đơn hàng này." },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Lỗi lấy chi tiết đơn hàng:", error);
    return NextResponse.json(
      { message: "Lỗi server." },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
