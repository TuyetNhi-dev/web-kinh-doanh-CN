"use client";

import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";
import CategorySidebar from "./CategorySidebar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const [mounted, setMounted] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  // Tránh lỗi hydration với Zustand persist
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1001, backgroundColor: '#fff', boxShadow: '0 4px 6px -6px rgba(0,0,0,0.1)' }}>
      {/* Main Bar */}
      <div className="header-main">
        <div className="container">
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <img src="/logo.png" alt="HBN Tech Store" style={{ height: '50px', objectFit: 'contain', filter: 'brightness(0.2) contrast(1.5)' }} />
          </Link>

          {/* Search Bar */}
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Tìm kiếm laptop, linh kiện PC, gaming gear..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" style={{ background: 'none', border: 'none', position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', padding: 0 }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'static', transform: 'none' }}></i>
            </button>
          </form>

          {/* User Actions */}
          <div className="header-actions">
            {session ? (
              <div 
                className="action-item" 
                style={{ cursor: 'pointer' }} 
                onClick={() => {
                  if (window.confirm("Bạn có muốn đăng xuất khỏi HBN TechStore không?")) {
                    signOut();
                  }
                }}
              >
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

            <div style={{ position: 'relative' }}>
              <motion.div 
                className="action-item" 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsNotifyOpen(!isNotifyOpen)}
              >
                <motion.i 
                  className="fa-regular fa-bell"
                  animate={!isNotifyOpen && unreadCount > 0 ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                ></motion.i>
                {mounted && unreadCount > 0 && (
                  <span style={{position: 'absolute', top: '-4px', right: '-4px', background: 'var(--pv-red, #da251d)', color: '#fff', fontSize: '9px', width: '15px', height: '15px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>{unreadCount}</span>
                )}
              </motion.div>
              
              <NotificationDropdown 
                isOpen={isNotifyOpen} 
                onClose={() => setIsNotifyOpen(false)} 
              />
            </div>

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
          <div 
            className="category-dropdown-wrapper" 
            style={{ position: 'relative' }}
            onMouseEnter={() => setIsCategoryHovered(true)}
            onMouseLeave={() => setIsCategoryHovered(false)}
          >
            <div className="category-btn">
              <i className="fa-solid fa-bars"></i>
              <span>Danh mục sản phẩm</span>
            </div>
            
            {/* Show dropdown on hover/tap. (Always enabled so mobile users on homepage can access categories) */}
            {isCategoryHovered && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '260px', zIndex: 1000, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                <CategorySidebar />
              </div>
            )}
          </div>
          <nav className="nav-links">
            <Link href="/products">Sản phẩm</Link>
            <Link href="/products?sort=bestseller">Bán chạy nhất</Link>
            <Link href="/products?sort=newest">Hàng mới về</Link>
            <Link href="/products?sale=true">Khuyến mãi</Link>
            <a href="#footer" onClick={(e) => {
              e.preventDefault();
              const footer = document.querySelector('.footer');
              if (footer) footer.scrollIntoView({ behavior: 'smooth' });
            }}>Hỗ trợ</a>
            {session?.user?.role === 'admin' && (
              <Link href="/admin" style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>Quản trị</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
