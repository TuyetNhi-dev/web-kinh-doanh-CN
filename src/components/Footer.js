"use client";

import { useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  // Keep keys aligned with checkout `paymentMethod` values: cod, banking, momo, vnpay
  const paymentMethods = [
    {
      key: "cod",
      label: "Tiền mặt",
      icon: "fa-money-bill-wave",
      info: "Thanh toán khi nhân viên giao hàng đến tận nơi.",
    },
    {
      key: "banking",
      label: "Chuyển khoản",
      icon: "fa-building-columns",
      info: "Thanh toán trực tuyến qua ngân hàng an toàn và tiện lợi.",
    },
    {
      key: "momo",
      label: "Ví MoMo",
      // try local asset first; fallback handled by PaymentIcon
      icon: "/images/momo.png",
      info: "Thanh toán qua ứng dụng MoMo (sandbox).",
    },
    {
      key: "vnpay",
      label: "VNPay",
      icon: "/images/vnpay.png",
      info: "Thanh toán qua cổng VNPay.",
    },
    {
      key: "qr",
      label: "QR Code",
      icon: "fa-qrcode",
      info: "Quét mã QR để thanh toán nhanh bằng ví điện tử hoặc ngân hàng.",
    },
  ];

  function PaymentIcon({ icon, label, size = 20 }) {
    const [failed, setFailed] = useState(false);
    const isImage = typeof icon === "string" && (icon.startsWith("/") || icon.startsWith("http"));
    if (isImage && !failed) {
      return (
        <img
          src={icon}
          alt={label}
          onError={() => setFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "contain", padding: "4px" }}
        />
      );
    }

    if (isImage && failed) {
      return (
        <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f3f3", color: "#333", borderRadius: 6, fontWeight: 700 }}>{label.slice(0,2).toUpperCase()}</div>
      );
    }

    // font icon
    return <i className={`fa-solid ${icon}`} style={{ fontSize: size, color: "#333" }}></i>;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-container">
          <div>
            <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
              <img
                src="/logo.png"
                alt="HBN Tech Store"
                style={{ height: "40px", objectFit: "contain", filter: "brightness(0.2) contrast(1.5)" }}
              />
            </Link>
            <p style={{ marginTop: "15px", color: "#555", fontSize: "0.95rem", marginBottom: "25px" }}>
              Nâng tầm trải nghiệm số của bạn với các thiết bị cao cấp.
            </p>
            
            <div className="payment-methods-sidebar">
              <h3 style={{ fontSize: "0.9rem", fontWeight: "700", marginBottom: "12px", color: "#111", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Phương thức thanh toán
              </h3>
              <div className="payment-method-list">
                {paymentMethods.map(method => {
                  const isSelected = selectedMethod === method.key;
                  return (
                    <button
                      key={method.key}
                      type="button"
                      className={`payment-method-button ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedMethod(method.key)}
                      style={{
                        border: isSelected ? "2px solid #ff8c00" : "1px solid #e0e0e0",
                        background: isSelected ? "rgba(255, 140, 0, 0.1)" : "white",
                      }}
                    >
                      <div className="payment-method-icon">
                        <PaymentIcon icon={method.icon} label={method.label} size={20} />
                      </div>
                      <span className="payment-method-label">{method.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className="payment-method-info">
                {selectedMethod ? (
                  <p>{paymentMethods.find(method => method.key === selectedMethod)?.info}</p>
                ) : (
                  <p>Nhấn vào một phương thức để xem thông tin thanh toán.</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3>Hỗ trợ khách hàng</h3>
            <ul>
              <li><Link href="/info/huong-dan-mua-hang">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/info/faq">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link href="/info/trung-tam-bao-hanh">Trung tâm bảo hành</Link></li>
              <li><Link href="/info/tra-cuu-don-hang">Tra cứu đơn hàng</Link></li>
            </ul>
          </div>

          <div>
            <h3>Chính sách</h3>
            <ul>
              <li><Link href="/info/bao-mat-thong-tin">Bảo mật thông tin</Link></li>
              <li><Link href="/info/chinh-sach-doi-tra">Chính sách Đổi trả</Link></li>
              <li><Link href="/info/chinh-sach-giao-hang">Chính sách Giao hàng</Link></li>
              <li><Link href="/info/chinh-sach-bao-hanh">Chính sách Bảo hành</Link></li>
            </ul>
          </div>

          <div>
            <h3>Liên hệ</h3>
            <ul>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <i className="fa-solid fa-phone" style={{ color: "var(--brand-orange)" }}></i>
                <a href="tel:18008888">1800-TECH</a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <i className="fa-solid fa-envelope" style={{ color: "var(--brand-orange)" }}></i>
                <a href="mailto:cskh@techstore.vn">cskh@techstore.vn</a>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <i className="fa-solid fa-location-dot" style={{ color: "var(--brand-orange)" }}></i>
                <span style={{ color: "#555", fontSize: "0.9rem" }}>123 Công Nghệ, Q1, HCM</span>
              </li>
            </ul>
            <ul style={{ display: "flex", gap: "15px", fontSize: "1.5rem" }}>
              <li><a href="#"><i className="fa-brands fa-facebook" style={{ color: "#1877F2" }}></i></a></li>
              <li><a href="#"><i className="fa-brands fa-instagram" style={{ color: "#E4405F" }}></i></a></li>
              <li><a href="#"><i className="fa-brands fa-tiktok" style={{ color: "#000000" }}></i></a></li>
              <li><a href="#"><i className="fa-brands fa-youtube" style={{ color: "#FF0000" }}></i></a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 HBN TechStore. Developed by Tuyet Nhi.</p>
        </div>
      </div>
    </footer>
  );
}
