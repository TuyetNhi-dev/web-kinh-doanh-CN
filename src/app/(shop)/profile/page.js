"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/profile");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data.id) setProfile(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));

      setOrdersLoading(true);
      fetch("/api/orders/history")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(console.error)
        .finally(() => setOrdersLoading(false));
    }
  }, [status, router]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Lỗi khi cập nhật.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setChangingPassword(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowPassword(false);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Lỗi khi đổi mật khẩu.");
    } finally {
      setChangingPassword(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container" style={{ padding: "80px 20px", minHeight: "70vh", textAlign: "center" }}>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (!profile) return null;

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    background: "rgba(255,255,255,0.05)",
    color: "var(--text-primary)",
    fontSize: "1rem",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    fontWeight: 600,
  };

  const statusLabel = {
    pending:    { text: "Chờ xác nhận", color: "#f59e0b" },
    processing: { text: "Đang xử lý",   color: "#3b82f6" },
    completed:  { text: "Hoàn thành",   color: "#10b981" },
    cancelled:  { text: "Đã hủy",       color: "#ef4444" },
  };

  return (
    <div className="container" style={{ padding: "60px 20px", minHeight: "80vh", maxWidth: "800px" }}>
      {/* Avatar + welcome */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "40px" }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--brand-orange), #ff8c42)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem", fontWeight: 800, color: "#fff", flexShrink: 0,
        }}>
          {(profile?.full_name || session?.user?.name || "?")[0].toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>
            {profile?.full_name || session?.user?.name || "Tài khoản"}
          </h1>
          <p style={{ color: "var(--text-secondary)", margin: "4px 0 0" }}>{profile?.email}</p>
        </div>
      </div>

      {/* Profile Info */}
      <form onSubmit={handleSave} className="glass" style={{ padding: "35px", borderRadius: "20px", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="fa-solid fa-id-card" style={{ color: "var(--brand-orange)" }}></i>
          Thông tin cá nhân
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={labelStyle}>Họ và tên</label>
            <input
              style={inputStyle}
              value={profile.full_name || ""}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} value={profile.email} readOnly />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={labelStyle}>Số điện thoại</label>
            <input
              style={inputStyle}
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="09xxxxxxxx"
            />
          </div>
          <div>
            <label style={labelStyle}>Ngày tham gia</label>
            <input
              style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }}
              value={new Date(profile.created_at).toLocaleDateString("vi-VN")}
              readOnly
            />
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={labelStyle}>Địa chỉ</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={profile.address || ""}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            placeholder="Số nhà, tên đường, quận/huyện, tỉnh/thành phố"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: "12px 35px" }}
          disabled={saving}
        >
          {saving ? "Đang lưu..." : "Lưu Thay Đổi"}
        </button>
      </form>

      {/* Order History */}
      <div className="glass" style={{ padding: "35px", borderRadius: "20px", marginBottom: "30px" }}>
        <h2 style={{ fontSize: "1.3rem", marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
          <i className="fa-solid fa-clock-rotate-left" style={{ color: "var(--brand-orange)" }}></i>
          Lịch sử đặt hàng
        </h2>

        {ordersLoading ? (
          <p style={{ color: "var(--text-secondary)" }}>Đang tải đơn hàng...</p>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: "var(--text-secondary)" }}>
            <i className="fa-solid fa-box-open" style={{ fontSize: "2.5rem", opacity: 0.3, display: "block", marginBottom: "12px" }}></i>
            <p>Bạn chưa có đơn hàng nào.</p>
            <Link href="/products" style={{ color: "var(--brand-orange)", fontWeight: 600, marginTop: "10px", display: "inline-block" }}>
              Mua sắm ngay →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {orders.map((order) => {
              const s = statusLabel[order.status] || { text: order.status, color: "#888" };
              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "16px 20px", borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    background: "var(--card-bg)",
                    transition: "border-color 0.2s",
                  }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--brand-orange)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                  >
                    <div>
                      <p style={{ fontWeight: 700, margin: 0 }}>Đơn hàng #{order.id}</p>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", margin: "4px 0 0" }}>
                        {new Date(order.created_at).toLocaleDateString("vi-VN", {
                          day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                        {" · "}
                        {order.items?.length || 0} sản phẩm
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 700, margin: 0, color: "var(--brand-orange)" }}>
                        {parseFloat(order.total_amount).toLocaleString("vi-VN")}đ
                      </p>
                      <span style={{
                        display: "inline-block", marginTop: "4px",
                        padding: "2px 10px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600,
                        background: s.color + "20", color: s.color,
                      }}>
                        {s.text}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Change Password */}
      <div className="glass" style={{ padding: "35px", borderRadius: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "1.3rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fa-solid fa-lock" style={{ color: "var(--brand-orange)" }}></i>
            Bảo mật
          </h2>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="btn btn-outline"
            style={{ padding: "8px 20px", fontSize: "0.9rem" }}
          >
            {showPassword ? "Đóng" : "Đổi mật khẩu"}
          </button>
        </div>

        {showPassword && (
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={labelStyle}>Mật khẩu hiện tại</label>
              <input
                type="password"
                style={inputStyle}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Mật khẩu mới</label>
              <input
                type="password"
                style={inputStyle}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Tối thiểu 6 ký tự"
                required
                minLength={6}
              />
            </div>
            <div>
              <label style={labelStyle}>Xác nhận mật khẩu mới</label>
              <input
                type="password"
                style={inputStyle}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "12px 35px", alignSelf: "flex-start" }}
              disabled={changingPassword}
            >
              {changingPassword ? "Đang xử lý..." : "Xác Nhận Đổi Mật Khẩu"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
