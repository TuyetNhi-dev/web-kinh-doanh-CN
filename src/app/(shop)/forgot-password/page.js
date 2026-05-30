"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      toast.success(data.message);
      setSent(true);
    } catch {
      toast.error("Lỗi khi gửi yêu cầu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "80px 20px", minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="glass" style={{ width: "100%", maxWidth: "450px", padding: "40px", textAlign: "center" }}>
        <i className="fa-solid fa-key" style={{ fontSize: "3rem", color: "var(--brand-orange)", marginBottom: "20px" }}></i>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>Quên Mật Khẩu</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "30px" }}>
          Nhập email đã đăng ký để nhận link đặt lại mật khẩu.
        </p>

        {sent ? (
          <div>
            <i className="fa-solid fa-circle-check" style={{ fontSize: "3rem", color: "#22c55e", marginBottom: "15px" }}></i>
            <p style={{ marginBottom: "20px", lineHeight: "1.6" }}>
              Nếu email <strong>{email}</strong> tồn tại trong hệ thống, link đặt lại mật khẩu đã được gửi.
            </p>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "25px" }}>
              (Kiểm tra terminal / console của server để thấy link reset)
            </p>
            <Link href="/login" className="btn btn-primary" style={{ padding: "12px 30px" }}>
              Quay về Đăng nhập
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                required
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)",
                  background: "rgba(0,0,0,0.3)",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: "15px", fontSize: "1.1rem" }} disabled={loading}>
              {loading ? "Đang gửi..." : "Gửi Link Đặt Lại Mật Khẩu"}
            </button>
          </form>
        )}

        <p style={{ marginTop: "25px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
          Nhớ mật khẩu rồi? <Link href="/login" style={{ color: "var(--accent-color)" }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
