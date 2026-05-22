"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const statusMap = {
  pending: { label: "Chờ xử lý", color: "#f59e0b", bg: "rgba(245,158,11,0.15)" },
  processing: { label: "Đã thanh toán", color: "#3b82f6", bg: "rgba(59,130,246,0.15)" },
  completed: { label: "Hoàn thành", color: "#22c55e", bg: "rgba(34,197,94,0.15)" },
  cancelled: { label: "Đã hủy", color: "#ef4444", bg: "rgba(239,68,68,0.15)" },
};

export default function OrderHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/orders");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/orders/history")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container" style={{ padding: "80px 20px", minHeight: "70vh", textAlign: "center" }}>
        <p>Đang tải lịch sử đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "60px 20px", minHeight: "80vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "40px" }}>
        <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: "12px", color: "var(--brand-orange)" }}></i>
        Lịch Sử Đơn Hàng
      </h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <i className="fa-solid fa-box-open" style={{ fontSize: "4rem", color: "rgba(255,255,255,0.1)", marginBottom: "20px" }}></i>
          <h2 style={{ marginBottom: "15px" }}>Chưa có đơn hàng nào</h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "30px" }}>Hãy khám phá và đặt mua sản phẩm công nghệ tại TechStore nhé!</p>
          <a href="/products" className="btn btn-primary" style={{ padding: "12px 30px" }}>Mua sắm ngay</a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          {orders.map((order) => {
            const st = statusMap[order.status] || statusMap.pending;
            return (
              <div key={order.id} className="glass" style={{ borderRadius: "16px", overflow: "hidden" }}>
                {/* Order header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 25px", borderBottom: "1px solid var(--border-color)", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>Đơn #{order.id}</span>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                      {new Date(order.created_at).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span style={{ padding: "6px 16px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600, color: st.color, background: st.bg }}>
                    {st.label}
                  </span>
                </div>

                {/* Order items */}
                <div style={{ padding: "20px 25px" }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: idx < order.items.length - 1 ? "15px" : "0", paddingBottom: idx < order.items.length - 1 ? "15px" : "0", borderBottom: idx < order.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div style={{ width: "60px", height: "60px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <i className="fa-solid fa-box" style={{ color: "var(--text-secondary)" }}></i>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, marginBottom: "4px" }}>{item.name || "Sản phẩm"}</p>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>SL: {item.quantity} × {new Intl.NumberFormat("vi-VN").format(item.price)}đ</p>
                      </div>
                      <span style={{ fontWeight: 600, color: "var(--brand-orange)" }}>
                        {new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)}đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 25px", borderTop: "1px solid var(--border-color)", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {order.shipping_address && (
                      <span><i className="fa-solid fa-location-dot" style={{ marginRight: "6px" }}></i>{order.shipping_address}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 700, fontSize: "1.15rem" }}>
                      Tổng: <span style={{ color: "var(--brand-orange)" }}>{new Intl.NumberFormat("vi-VN").format(order.total_amount)}đ</span>
                    </div>
                    <button onClick={() => router.push(`/orders/${order.id}`)} className="btn btn-outline" style={{ padding: "8px 15px", fontSize: "0.9rem" }}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
