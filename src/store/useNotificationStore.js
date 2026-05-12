import { create } from "zustand";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1)  return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

function mapRow(row) {
  return {
    id:       row.id,
    type:     row.type,
    title:    row.title,
    content:  row.content,
    isRead:   Boolean(row.is_read),
    time:     timeAgo(row.created_at),
  };
}

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  // Fetch từ API — gọi khi user đăng nhập
  fetchNotifications: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const res  = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = await res.json();
      set({ notifications: Array.isArray(data) ? data.map(mapRow) : [] });
    } catch {
      // Lỗi mạng — giữ nguyên state cũ
    } finally {
      set({ loading: false });
    }
  },

  // Đánh dấu 1 thông báo đã đọc
  markAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    }));
    await fetch("/api/notifications", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ id }),
    }).catch(() => {});
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    }));
    await fetch("/api/notifications", {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ all: true }),
    }).catch(() => {});
  },

  getUnreadCount: () => get().notifications.filter((n) => !n.isRead).length,
}));
