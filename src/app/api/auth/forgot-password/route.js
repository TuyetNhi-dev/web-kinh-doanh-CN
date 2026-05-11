import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  let connection;
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Vui lòng nhập email." }, { status: 400 });
    }

    connection = await getConnection();

    // Check if user exists
    const [users] = await connection.execute(
      "SELECT id, email FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      // Don't reveal if email exists or not (security best practice)
      return NextResponse.json({ message: "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save to DB
    await connection.execute(
      "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
      [email, token, expiresAt]
    );

    // Generate reset link
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    // TODO: Send email with resetLink (using Nodemailer)
    // For now, log to console
    console.log("\n========================================");
    console.log("🔑 PASSWORD RESET REQUEST");
    console.log("========================================");
    console.log(`📧 Email: ${email}`);
    console.log(`🔗 Reset Link: ${resetLink}`);
    console.log(`⏰ Expires: ${expiresAt.toLocaleString("vi-VN")}`);
    console.log("========================================\n");

    return NextResponse.json({
      message: "Nếu email tồn tại, link đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.",
    });
  } catch (error) {
    console.error("Lỗi forgot password:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
