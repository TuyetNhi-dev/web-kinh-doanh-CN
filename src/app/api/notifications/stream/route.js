export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getConnection } from "@/lib/db";

/**
 * GET /api/notifications/stream
 * Server-Sent Events — gửi notification mới theo thời gian thực.
 * Client nhận event "notification" mỗi khi có thông báo mới.
 */
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Lấy user_id
  let userId;
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      "SELECT id FROM users WHERE email = ?",
      [session.user.email]
    );
    conn.release();
    userId = rows[0]?.id;
  } catch {
    return new Response("Server error", { status: 500 });
  }

  if (!userId) {
    return new Response("User not found", { status: 404 });
  }

  // lastId = ID lớn nhất hiện có — chỉ gửi notification MỚI hơn
  let lastId = 0;
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      "SELECT COALESCE(MAX(id), 0) AS maxId FROM notifications WHERE user_id = ?",
      [userId]
    );
    conn.release();
    lastId = rows[0]?.maxId ?? 0;
  } catch {
    lastId = 0;
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Gửi heartbeat ngay khi connect để giữ kết nối
      controller.enqueue(encoder.encode(": heartbeat\n\n"));

      const interval = setInterval(async () => {
        try {
          const conn = await getConnection();
          const [rows] = await conn.execute(
            `SELECT id, type, title, content, is_read, created_at
             FROM notifications
             WHERE user_id = ? AND id > ?
             ORDER BY id ASC`,
            [userId, lastId]
          );
          conn.release();

          for (const row of rows) {
            lastId = row.id;
            const data = JSON.stringify({
              id:       row.id,
              type:     row.type,
              title:    row.title,
              content:  row.content,
              isRead:   Boolean(row.is_read),
              createdAt: row.created_at,
            });
            controller.enqueue(encoder.encode(`event: notification\ndata: ${data}\n\n`));
          }

          // Heartbeat mỗi 30s để giữ kết nối không bị timeout
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          // DB lỗi tạm thời — bỏ qua, thử lại lần sau
        }
      }, 4000); // Poll DB mỗi 4 giây

      // Dọn dẹp khi client disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection":    "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
