"use client";

import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const [mounted, setMounted] = useState(false);

  // Tránh lỗi hydration với Zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      {/* Main Bar */}
      <div className="header-main">
        <div className="container">
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo.png" alt="HBN Tech Store" style={{ height: '50px', objectFit: 'contain', filter: 'brightness(0.2) contrast(1.5)' }} />
          </Link>

          {/* Search Bar */}
          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm laptop, linh kiện PC, gaming gear..." />
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>

          {/* User Actions */}
          <div className="header-actions">
            {session ? (
              <div className="action-item" style={{ cursor: 'pointer' }} onClick={() => signOut()}>
                <i className="fa-regular fa-user"></i>
                <div style={{ lineHeight: '1.2' }}>
                  <span style={{display: 'block', fontSize: '0.85rem', fontWeight: 'bold'}}>{session.user.name}</span>
                  <span style={{fontSize: '0.75rem', color: '#888'}}>Đăng xuất</span>
                </div>
              </div>
            ) : (
              <Link href="/login" className="action-item">
                <i className="fa-regular fa-user"></i>
                <div style={{ lineHeight: '1.2' }}>
                  <span style={{display: 'block', fontSize: '0.85rem', fontWeight: 'bold'}}>Đăng nhập</span>
                  <span style={{fontSize: '0.75rem', color: '#888'}}>Đăng ký</span>
                </div>
              </Link>
            )}

            <Link href="#" className="action-item" style={{ position: 'relative' }}>
              <i className="fa-regular fa-bell"></i>
              <span style={{position: 'absolute', top: '-4px', right: '-4px', background: 'var(--pv-red, #da251d)', color: '#fff', fontSize: '9px', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>3</span>
            </Link>

            <Link href="/cart" className="action-item">
              <i className="fa-solid fa-cart-shopping"></i>
              <div style={{ lineHeight: '1.2' }}>
                <span style={{display: 'block', fontSize: '0.85rem', fontWeight: 'bold'}}>Giỏ hàng</span>
                <span style={{fontSize: '0.75rem', color: '#888'}}>
                  {mounted ? totalItems : 0} sản phẩm
                </span>
              </div>
            </Link>
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
            <Link href="/products">Sản phẩm</Link>
            <a href="#">Bán chạy nhất</a>
            <a href="#">Hàng mới về</a>
            <a href="#">Khuyến mãi</a>
            <a href="#">Hỗ trợ</a>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Quản trị</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
