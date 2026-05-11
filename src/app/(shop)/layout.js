import { Providers } from '../../components/Providers';
import Header from '../../components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'HBN TechStore | Mua Sắm Dễ Dàng, Gắn Kết Tương Lai',
  description: 'Cửa hàng thiết bị công nghệ hàng đầu, chuyên cung cấp Laptop, PC, Phụ kiện chính hãng.',
};

export default function ShopLayout({ children }) {
  return (
    <>
      <div className="header-top">
        <div className="container" style={{justifyContent: 'flex-start'}}>
          <Link href="/showrooms">Hệ thống Showroom</Link>
          <a href="tel:18008888">Hotline: 1800-TECH</a>
          <Link href="/news">Tin tức</Link>
        </div>
      </div>

      <Header />

      <main>
        {children}
      </main>

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
              <h3>Hỗ trợ khách hàng</h3>
              <ul>
                <li><a href="#">Hướng dẫn mua hàng</a></li>
                <li><a href="#">Câu hỏi thường gặp (FAQ)</a></li>
                <li><a href="#">Trung tâm bảo hành</a></li>
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
              <h3>Liên hệ</h3>
              <ul>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <i className="fa-solid fa-phone" style={{ color: 'var(--brand-orange)' }}></i>
                  <a href="tel:18008888">1800-TECH</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <i className="fa-solid fa-envelope" style={{ color: 'var(--brand-orange)' }}></i>
                  <a href="mailto:cskh@techstore.vn">cskh@techstore.vn</a>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <i className="fa-solid fa-location-dot" style={{ color: 'var(--brand-orange)' }}></i>
                  <span style={{ color: '#555', fontSize: '0.9rem' }}>123 Công Nghệ, Q1, HCM</span>
                </li>
              </ul>
              <ul style={{display: 'flex', gap: '15px', fontSize: '1.5rem'}}>
                <li><a href="#"><i className="fa-brands fa-facebook" style={{ color: '#1877F2' }}></i></a></li>
                <li><a href="#"><i className="fa-brands fa-instagram" style={{ color: '#E4405F' }}></i></a></li>
                <li><a href="#"><i className="fa-brands fa-tiktok" style={{ color: '#000000' }}></i></a></li>
                <li><a href="#"><i className="fa-brands fa-youtube" style={{ color: '#FF0000' }}></i></a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 HBN TechStore. Developed by Tuyet Nhi.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
