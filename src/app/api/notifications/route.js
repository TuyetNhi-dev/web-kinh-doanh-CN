export const dynamic = 'force-dynamic';
import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Lấy user_id từ session
async function getUserId(connection, session) {
  const [rows] = await connection.execute(
    "SELECT id FROM users WHERE email = ?",
    [session.user.email]
  );
  return rows[0]?.id ?? null;
}

// GET /api/notifications — lấy danh sách thông báo của user hiện tại
export async function GET() {
  let connection;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Chưa đăng nhập." }, { status: 401 });
    }

    connection = await getConnection();
    const userId = await getUserId(connection, session);

    if (!userId) {
      return NextResponse.json([], { status: 200 });
    }

    const [rows] = await connection.execute(
      `SELECT id, type, title, content, is_read, created_at
       FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 30`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Lỗi GET notifications:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

// PATCH /api/notifications — đánh dấu đã đọc
// Body: { id: number } để đọc 1 cái, hoặc { all: true } để đọc tất cả
export async function PATCH(req) {
  let connection;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Chưa đăng nhập." }, { status: 401 });
    }

    const body = await req.json();
    connection  = await getConnection();
    const userId = await getUserId(connection, session);

    if (!userId) {
      return NextResponse.json({ message: "Không tìm thấy người dùng." }, { status: 404 });
    }

    if (body.all) {
      await connection.execute(
        "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
        [userId]
      );
    } else if (body.id) {
      await connection.execute(
        "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
        [body.id, userId]
      );
    } else {
      return NextResponse.json({ message: "Thiếu tham số id hoặc all." }, { status: 400 });
    }

    return NextResponse.json({ message: "Đã cập nhật." });
  } catch (error) {
    console.error("Lỗi PATCH notifications:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
