"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setSuccess(true);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Lỗi khi đặt lại mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="glass" style={{ width: "100%", maxWidth: "450px", padding: "40px", textAlign: "center" }}>
        <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: "3rem", color: "#ef4444", marginBottom: "15px" }}></i>
        <h2 style={{ marginBottom: "15px" }}>Link không hợp lệ</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "25px" }}>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
        <Link href="/forgot-password" className="btn btn-primary" style={{ padding: "12px 30px" }}>Yêu cầu link mới</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="glass" style={{ width: "100%", maxWidth: "450px", padding: "40px", textAlign: "center" }}>
        <i className="fa-solid fa-circle-check" style={{ fontSize: "3rem", color: "#22c55e", marginBottom: "15px" }}></i>
        <h2 style={{ marginBottom: "15px" }}>Đặt Lại Mật Khẩu Thành Công!</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "25px" }}>Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.</p>
        <Link href="/login" className="btn btn-primary" style={{ padding: "12px 30px" }}>Đăng Nhập Ngay</Link>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    background: "rgba(0,0,0,0.3)",
    color: "white",
    outline: "none",
  };

  return (
    <div className="glass" style={{ width: "100%", maxWidth: "450px", padding: "40px", textAlign: "center" }}>
      <i className="fa-solid fa-lock-open" style={{ fontSize: "3rem", color: "var(--brand-orange)", marginBottom: "20px" }}></i>
      <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>Đặt Lại Mật Khẩu</h2>
      <p style={{ color: "var(--text-secondary)", marginBottom: "30px" }}>Nhập mật khẩu mới cho tài khoản của bạn.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Mật khẩu mới</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tối thiểu 6 ký tự"
            required
            minLength={6}
            style={inputStyle}
          />
        </div>
        <div style={{ textAlign: "left" }}>
          <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Xác nhận mật khẩu</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: "15px", fontSize: "1.1rem" }} disabled={loading}>
          {loading ? "Đang xử lý..." : "Đặt Lại Mật Khẩu"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container" style={{ padding: "80px 20px", minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Suspense fallback={<p>Đang tải...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
