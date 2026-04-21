import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

async function insertUser(connection, email, hashedPassword, full_name) {
  try {
    await connection.execute(
      "INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, full_name, "customer"]
    );
  } catch (error) {
    if (error?.code === "ER_BAD_FIELD_ERROR" || error?.message?.includes("Unknown column")) {
      await connection.execute(
        "INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, full_name, "customer"]
      );
    } else {
      throw error;
    }
  }
}

export async function POST(req) {
  let connection;
  try {
    const { email, password, full_name } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ thông tin." },
        { status: 400 }
      );
    }

    connection = await getConnection();

    // Kiểm tra email tồn tại
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "Email này đã được sử dụng." },
        { status: 400 }
      );
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu người dùng vào DB
    await insertUser(connection, email, hashedPassword, full_name);

    return NextResponse.json(
      { message: "Đăng ký thành công!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lỗi đăng ký:", error);

    let serverMessage = "Lỗi server khi đăng ký.";
    if (error.message.includes("DB_PASSWORD")) {
      serverMessage = error.message;
    } else if (process.env.NODE_ENV !== "production") {
      serverMessage = error.message;
    }

    return NextResponse.json(
      { message: serverMessage },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
