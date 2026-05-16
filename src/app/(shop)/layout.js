import { Providers } from '../../components/Providers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
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

      <Footer />
    </>
  );
}
