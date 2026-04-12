import { Providers } from '../components/Providers';
import Header from '../components/Header';
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
        <Providers>
          {/* Top Bar (Not sticky) */}
          <div className="header-top">
            <div className="container" style={{justifyContent: 'flex-start'}}>
              <a href="#">Hệ thống Showroom</a>
              <a href="#">Hotline: 1800-TECH</a>
              <a href="#">Tin tức</a>
            </div>
          </div>

          <Header />

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
                     <img src="/logo.png" alt="HBN Tech Store" style={{ height: '40px', objectFit: 'contain', filter: 'brightness(0.2) contrast(1.5)' }} />
                  </a>
                  <p style={{marginTop: '15px', color: '#555'}}>Nâng tầm trải nghiệm số của bạn với các thiết bị cao cấp.</p>
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
                  <h3>Chính sách</h3>
                  <ul>
                    <li><a href="#">Bảo mật thông tin</a></li>
                    <li><a href="#">Chính sách Đổi trả</a></li>
                    <li><a href="#">Chính sách Giao hàng</a></li>
                    <li><a href="#">Chính sách Bảo hành</a></li>
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
        </Providers>
      </body>
    </html>
  );
}
