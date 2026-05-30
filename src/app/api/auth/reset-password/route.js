export const dynamic = 'force-dynamic';
import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
  let connection;
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." }, { status: 400 });
    }

    connection = await getConnection();

    // Find valid token
    const [resets] = await connection.execute(
      "SELECT * FROM password_resets WHERE token = ? AND used = FALSE AND expires_at > NOW()",
      [token]
    );

    if (resets.length === 0) {
      return NextResponse.json({ message: "Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ." }, { status: 400 });
    }

    const resetRecord = resets[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await connection.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, resetRecord.email]
    );

    // Mark token as used
    await connection.execute(
      "UPDATE password_resets SET used = TRUE WHERE id = ?",
      [resetRecord.id]
    );

    console.log(`✅ Password reset successful for: ${resetRecord.email}`);

    return NextResponse.json({ message: "Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay." });
  } catch (error) {
    console.error("Lỗi reset password:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
