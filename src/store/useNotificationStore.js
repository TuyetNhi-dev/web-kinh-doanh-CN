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
    time:     timeAgo(row.created_at || row.createdAt),
  };
}

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  _eventSource: null,

  // Fetch toàn bộ notification ban đầu
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

  // Kết nối SSE để nhận notification realtime
  connectSSE: () => {
    // Đóng kết nối cũ nếu còn
    const prev = get()._eventSource;
    if (prev) prev.close();

    const es = new EventSource("/api/notifications/stream");

    es.addEventListener("notification", (e) => {
      try {
        const row = JSON.parse(e.data);
        const newNotif = {
          id:      row.id,
          type:    row.type,
          title:   row.title,
          content: row.content,
          isRead:  Boolean(row.isRead),
          time:    timeAgo(row.createdAt),
        };
        set((state) => {
          // Tránh duplicate
          const exists = state.notifications.some((n) => n.id === newNotif.id);
          if (exists) return state;
          return { notifications: [newNotif, ...state.notifications] };
        });
      } catch {
        // parse error — bỏ qua
      }
    });

    es.onerror = () => {
      // Reconnect tự động sau 5s nếu bị ngắt
      es.close();
      set({ _eventSource: null });
      setTimeout(() => {
        if (get()._eventSource === null) get().connectSSE();
      }, 5000);
    };

    set({ _eventSource: es });
  },

  // Ngắt SSE (khi user logout)
  disconnectSSE: () => {
    const es = get()._eventSource;
    if (es) { es.close(); set({ _eventSource: null }); }
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
