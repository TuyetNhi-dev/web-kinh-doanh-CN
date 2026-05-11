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
    const [rows] = await connection.execute(
      "SELECT id, email, full_name, phone, address, role, created_at FROM users WHERE email = ?",
      [session.user.email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy user." }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Lỗi lấy profile:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function PUT(req) {
  let connection;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
    }

    const { full_name, phone, address } = await req.json();

    connection = await getConnection();
    await connection.execute(
      "UPDATE users SET full_name = ?, phone = ?, address = ? WHERE email = ?",
      [full_name, phone || null, address || null, session.user.email]
    );

    return NextResponse.json({ message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi cập nhật profile:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
