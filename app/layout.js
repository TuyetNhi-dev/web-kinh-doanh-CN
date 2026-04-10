import './globals.css';

export const metadata = {
  title: 'TechStore | Công nghệ đỉnh cao',
  description: 'Trạm mua sắm thiết bị công nghệ hàng đầu, hiện đại, nhanh chóng. Giao hàng 2 tiếng tận nơi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        {/* Navigation Bar */}
        <nav className="navbar glass">
          <div className="container nav-container">
            <a href="/" className="logo">
              TECH<span>STORE</span>
            </a>
            
            <div className="nav-links">
              <a href="/" className="active">Trang Chủ</a>
              <a href="/products">Sản Phẩm</a>
              <a href="/promotions">Khuyến Mãi</a>
            </div>

            <div className="nav-actions">
              <a href="/cart" className="menu-icon"><i className="fa-solid fa-cart-shopping"></i></a>
              <a href="/login" className="btn btn-outline">Đăng Nhập</a>
            </div>
          </div>
        </nav>

        {/* Dynamic Pages */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-container">
              <div>
                <a href="/" className="logo" style={{fontSize: '1.5rem'}}>TECH<span>STORE</span></a>
                <p style={{marginTop: '15px'}}>Nâng tầm trải nghiệm số của bạn với các thiết bị cao cấp.</p>
              </div>
              <div>
                <h3>Danh mục</h3>
                <ul>
                  <li><a href="#">MacBook & Laptop</a></li>
                  <li><a href="#">Smartphone</a></li>
                  <li><a href="#">Phụ Kiện Thông Minh</a></li>
                </ul>
              </div>
              <div>
                <h3>Kết nối</h3>
                <ul style={{display: 'flex', gap: '15px', fontSize: '1.5rem'}}>
                  <li><a href="#"><i className="fa-brands fa-facebook"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                  <li><a href="#"><i className="fa-brands fa-youtube"></i></a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; 2026 TechStore. Developed by Antigravity.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
