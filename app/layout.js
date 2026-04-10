import './globals.css';

export const metadata = {
  title: 'TechStore | Mua Sắm Dễ Dàng, Gắn Kết Tương Lai',
  description: 'Cửa hàng thiết bị công nghệ hàng đầu, chuyên cung cấp Laptop, PC, Phụ kiện chính hãng.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
          {/* Top Bar (Not sticky) */}
          <div className="header-top">
            <div className="container" style={{justifyContent: 'flex-start'}}>
              <a href="#">Hệ thống Showroom</a>
              <a href="#">Hotline: 1800-TECH</a>
              <a href="#">Tin tức</a>
            </div>
          </div>

        <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
          {/* Main Bar */}
          <div className="header-main">
            <div className="container">
              {/* Logo */}
              <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <img src="/logo.png" alt="HBN Tech Store" style={{ height: '50px', objectFit: 'contain', filter: 'brightness(0.2) contrast(1.5)' }} />
              </a>

              {/* Search Bar */}
              <div className="search-bar">
                <input type="text" placeholder="Tìm kiếm laptop, linh kiện PC, gaming gear..." />
                <i className="fa-solid fa-magnifying-glass"></i>
              </div>

              {/* User Actions */}
              <div className="header-actions">
                <a href="/login" className="action-item">
                  <i className="fa-regular fa-user"></i>
                  <div style={{ lineHeight: '1.2' }}>
                    <span style={{display: 'block', fontSize: '0.85rem', fontWeight: 'bold'}}>Đăng nhập</span>
                    <span style={{fontSize: '0.75rem', color: '#888'}}>Đăng ký</span>
                  </div>
                </a>
                <a href="#" className="action-item" style={{ position: 'relative' }}>
                  <i className="fa-regular fa-bell"></i>
                  <span style={{position: 'absolute', top: '-4px', right: '-4px', background: 'var(--pv-red, #da251d)', color: '#fff', fontSize: '9px', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>3</span>
                </a>
                <a href="/cart" className="action-item">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <div style={{ lineHeight: '1.2' }}>
                    <span style={{display: 'block', fontSize: '0.85rem', fontWeight: 'bold'}}>Giỏ hàng</span>
                    <span style={{fontSize: '0.75rem', color: '#888'}}>0 sản phẩm</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Categories */}
          <div className="header-bottom">
            <div className="container">
              <div className="category-btn">
                <i className="fa-solid fa-bars"></i>
                <span>Danh mục sản phẩm</span>
              </div>
              <nav className="nav-links">
                <a href="#">Bán chạy nhất</a>
                <a href="#">Hàng mới về</a>
                <a href="#">Khuyến mãi</a>
                <a href="#">Xây dựng cấu hình</a>
                <a href="#">Hỗ trợ</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-container">
              <div>
                <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                   <img src="/logo.png" alt="HBN Tech Store" style={{ height: '40px', objectFit: 'contain', filter: 'brightness(0.3) contrast(1.2)' }} />
                </a>
                <p style={{marginTop: '15px', color: '#ccc'}}>Nâng tầm trải nghiệm số của bạn với các thiết bị cao cấp.</p>
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
              <p>&copy; 2026 HBN TechStore. Developed by Antigravity.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
