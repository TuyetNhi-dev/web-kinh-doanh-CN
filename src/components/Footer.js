import Link from "next/link";

export default function Footer() {

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
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ background: "white", padding: "5px 10px", borderRadius: "6px", border: "1px solid #ddd", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src="https://haitrieu.com/wp-content/uploads/2021/11/Logo-VNPAY-QR-1.png" 
                    alt="VNPAY" 
                    style={{ height: "20px", objectFit: "contain" }}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div style={{ background: "white", padding: "5px 10px", borderRadius: "6px", border: "1px solid #ddd", height: "35px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img 
                    src="https://static.mservice.io/img/logo-momo.png" 
                    alt="MoMo" 
                    style={{ height: "20px", objectFit: "contain" }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3>Hỗ trợ khách hàng</h3>
            <ul>
              <li><Link href="#">Hướng dẫn mua hàng</Link></li>
              <li><Link href="#">Câu hỏi thường gặp (FAQ)</Link></li>
              <li><Link href="#">Trung tâm bảo hành</Link></li>
              <li><Link href="#">Tra cứu đơn hàng</Link></li>
            </ul>
          </div>

          <div>
            <h3>Chính sách</h3>
            <ul>
              <li><Link href="#">Bảo mật thông tin</Link></li>
              <li><Link href="#">Chính sách Đổi trả</Link></li>
              <li><Link href="#">Chính sách Giao hàng</Link></li>
              <li><Link href="#">Chính sách Bảo hành</Link></li>
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
