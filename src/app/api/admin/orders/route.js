export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { createNotification, ORDER_STATUS_LABELS } from "@/lib/notifications";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin" ? session : null;
}

// GET /api/admin/orders — danh sách đơn hàng
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  let connection;
  try {
    connection = await getConnection();
    const [orders] = await connection.query(`
      SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at,
             u.full_name, u.email,
             COUNT(oi.id) AS item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Lỗi GET admin/orders:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

// PATCH /api/admin/orders — cập nhật trạng thái đơn hàng
export async function PATCH(req) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  let connection;
  try {
    const { id, status } = await req.json();

    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    connection = await getConnection();

    // Lấy thông tin đơn hàng để gửi notification
    const [orderRows] = await connection.execute(
      "SELECT user_id FROM orders WHERE id = ?",
      [id]
    );

    if (orderRows.length === 0) {
      return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
    }

    await connection.execute(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    // Tạo thông báo cho user
    const userId = orderRows[0].user_id;
    if (userId) {
      const statusLabel = ORDER_STATUS_LABELS[status] ?? status;
      await createNotification(connection, {
        userId,
        type:    "order",
        title:   `Đơn hàng #${id}: ${statusLabel}`,
        content: getStatusMessage(status, id),
      });
    }

    return NextResponse.json({ message: "Cập nhật trạng thái thành công" });
  } catch (error) {
    console.error("Lỗi PATCH admin/orders:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

function getStatusMessage(status, orderId) {
  switch (status) {
    case "processing":
      return `Đơn hàng #${orderId} của bạn đang được xử lý và chuẩn bị giao.`;
    case "completed":
      return `Đơn hàng #${orderId} đã được giao thành công. Cảm ơn bạn đã mua hàng!`;
    case "cancelled":
      return `Đơn hàng #${orderId} đã bị huỷ. Vui lòng liên hệ hỗ trợ nếu cần giải đáp.`;
    default:
      return `Trạng thái đơn hàng #${orderId} đã được cập nhật.`;
  }
}
