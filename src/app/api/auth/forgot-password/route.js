export const dynamic = 'force-dynamic';
import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendEmail, buildResetPasswordEmail } from "@/lib/email";

export async function POST(req) {
  let connection;
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Vui lòng nhập email." }, { status: 400 });
    }

    connection = await getConnection();

    const [users] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    // Không tiết lộ email có tồn tại hay không (bảo mật)
    if (users.length === 0) {
      return NextResponse.json({
        message: "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi.",
      });
    }

    const token     = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 giờ

    await connection.execute(
      "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
      [email, token, expiresAt]
    );

    const baseUrl   = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: "Đặt lại mật khẩu — HBN TechStore",
      html: buildResetPasswordEmail({ resetLink, expiresAt }),
    });

    return NextResponse.json({
      message: "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.",
    });
  } catch (error) {
    console.error("Lỗi forgot-password:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
