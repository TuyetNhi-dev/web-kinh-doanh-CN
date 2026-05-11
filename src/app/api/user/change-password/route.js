import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

export async function PUT(req) {
  let connection;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Vui lòng nhập đầy đủ thông tin." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." }, { status: 400 });
    }

    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT password FROM users WHERE email = ?",
      [session.user.email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy user." }, { status: 404 });
    }

    const storedHash = rows[0].password;

    if (!storedHash) {
      return NextResponse.json({ message: "Tài khoản đăng nhập bằng Google không thể đổi mật khẩu tại đây." }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(currentPassword, storedHash);
    if (!isMatch) {
      return NextResponse.json({ message: "Mật khẩu hiện tại không đúng." }, { status: 400 });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await connection.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedNew, session.user.email]
    );

    return NextResponse.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
