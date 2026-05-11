"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPassword, setChangingPassword] = useState(false);

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

  return (
    <div className="container" style={{ padding: "60px 20px", minHeight: "80vh", maxWidth: "800px" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "40px" }}>
        <i className="fa-solid fa-user-gear" style={{ marginRight: "12px", color: "var(--brand-orange)" }}></i>
        Tài Khoản Của Tôi
      </h1>

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
