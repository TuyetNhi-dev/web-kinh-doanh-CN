/**
 * Tạo một thông báo cho user trong DB.
 * @param {import('mysql2/promise').PoolConnection} connection - connection đang dùng (chưa release)
 * @param {{ userId: number, type: 'order'|'promo'|'system', title: string, content: string }} param
 */
export async function createNotification(connection, { userId, type, title, content }) {
  await connection.execute(
    "INSERT INTO notifications (user_id, type, title, content) VALUES (?, ?, ?, ?)",
    [userId, type, title, content]
  );
}

export const ORDER_STATUS_LABELS = {
  pending:    "Chờ xác nhận",
  processing: "Đang xử lý",
  completed:  "Đã giao hàng",
  cancelled:  "Đã huỷ",
};
