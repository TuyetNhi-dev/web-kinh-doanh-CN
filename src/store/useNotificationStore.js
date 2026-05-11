import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialNotifications = [
  {
    id: 1,
    category: "Ưu đãi",
    title: "Chào mừng đến với HBN TechStore!",
    content: "Cảm ơn bạn đã tin tưởng. Khám phá ngay hàng ngàn ưu đãi hấp dẫn đang chờ đón.",
    time: "2 giờ trước",
    isRead: false,
    type: "welcome",
    icon: "fa-solid fa-hand-sparkles",
    color: "#f57224"
  },
  {
    id: 2,
    category: "Khuyến mãi",
    title: "🔥 Flash Sale đang diễn ra!",
    content: "Giảm tới 50% cho các dòng Laptop Gaming. Đừng bỏ lỡ!",
    time: "5 giờ trước",
    isRead: false,
    type: "promo",
    icon: "fa-solid fa-fire",
    color: "#ff4d4d"
  },
  {
    id: 3,
    category: "Đơn hàng",
    title: "Đơn hàng #12345 đã được xác nhận",
    content: "Sản phẩm của bạn đang được chuẩn bị và sẽ sớm giao tới bạn.",
    time: "1 ngày trước",
    isRead: true,
    type: "order",
    icon: "fa-solid fa-box-open",
    color: "#1c1e21"
  }
];

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: initialNotifications,
      
      markAllAsRead: () => {
        set({
          notifications: get().notifications.map(n => ({ ...n, isRead: true }))
        });
      },

      markAsRead: (id) => {
        set({
          notifications: get().notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
        });
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.isRead).length;
      }
    }),
    {
      name: "hbn-notifications",
    }
  )
);
