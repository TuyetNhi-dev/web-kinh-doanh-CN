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

    // Kiểm tra quyền truy cập (chỉ người đặt hoặc admin mới xem được)
    // Giả sử session.user.email được dùng để xác thực
    if (order.customer_email !== session.user.email) {
       // Kiểm tra xem có phải admin không (tuỳ logic của bạn)
       // return NextResponse.json({ message: "Không có quyền xem đơn hàng này." }, { status: 403 });
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
