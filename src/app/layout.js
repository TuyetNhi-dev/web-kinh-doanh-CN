import { Providers } from '../components/Providers';
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
