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

export default function Header() {
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  const notifications = useNotificationStore((state) => state.notifications);

  const totalItems  = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  const [mounted, setMounted]               = useState(false);
  const [isNotifyOpen, setIsNotifyOpen]     = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");

  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  // Fetch thông báo từ API sau khi đăng nhập
  useEffect(() => {
    if (session) fetchNotifications();
  }, [session, fetchNotifications]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsNotifyOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    router.push(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="site-header">
      {/* ── Main Bar ─────────────────────────────── */}
      <div className="header-main">
        <div className="container">
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(true)} aria-label="Mở menu">
            <i className="fa-solid fa-bars"></i>
          </button>

          <Link href="/" className="header-logo">
            <img src="/logo.png" alt="HBN Tech Store" className="header-logo-img" />
          </Link>

          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm laptop, điện thoại, phụ kiện..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-submit-btn" aria-label="Tìm kiếm">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>

          <div className="header-actions">
            {/* Tài khoản */}
            {session ? (
              <div
                className="action-item"
                onMouseEnter={(e) => e.currentTarget.querySelector(".user-dropdown")?.classList.add("show")}
                onMouseLeave={(e) => e.currentTarget.querySelector(".user-dropdown")?.classList.remove("show")}
              >
                <i className="fa-regular fa-user"></i>
                <div className="action-text">
                  <span className="action-text-main">{session.user.name}</span>
                  <span className="action-text-sub">Tài khoản ▾</span>
                </div>

                <div className="user-dropdown">
                  <Link href="/profile" className="user-dropdown-link">
                    <i className="fa-solid fa-user-gear"></i> Thông tin cá nhân
                  </Link>
                  <Link href="/orders" className="user-dropdown-link">
                    <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử đơn hàng
                  </Link>
                  <div className="user-dropdown-divider" />
                  <div
                    className="user-dropdown-logout"
                    onClick={() => { if (window.confirm("Bạn có muốn đăng xuất không?")) signOut(); }}
                  >
                    <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="action-item">
                <i className="fa-regular fa-user"></i>
                <div className="action-text">
                  <span className="action-text-main">Đăng nhập</span>
                  <span className="action-text-sub">Đăng ký</span>
                </div>
              </Link>
            )}

            {/* Thông báo */}
            <div style={{ position: "relative" }}>
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
                />
                {mounted && unreadCount > 0 && (
                  <span className="notif-badge">{unreadCount}</span>
                )}
              </motion.div>
              <NotificationDropdown isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} />
            </div>

            {/* Giỏ hàng */}
            <Link href="/cart" className="action-item">
              <i className="fa-solid fa-cart-shopping"></i>
              <div className="action-text">
                <span className="action-text-main">Giỏ hàng</span>
                <span className="action-text-sub">{mounted ? totalItems : 0} sản phẩm</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ───────────────────────────── */}
      <div className="header-bottom">
        <div className="container">
          <div
            className="category-dropdown-wrapper"
            onMouseEnter={() => setIsCategoryOpen(true)}
            onMouseLeave={() => setIsCategoryOpen(false)}
          >
            <div className="category-btn">
              <i className="fa-solid fa-bars"></i>
              <span>Danh mục sản phẩm</span>
            </div>
            {isCategoryOpen && (
              <div className="category-dropdown-panel">
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
              document.querySelector(".footer")?.scrollIntoView({ behavior: "smooth" });
            }}>Hỗ trợ</a>
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="nav-admin-link">Quản trị</Link>
            )}
          </nav>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ─────────────── */}
      <div className={`mobile-nav-overlay${isMobileMenuOpen ? " open" : ""}`} onClick={closeMenu} aria-hidden="true" />

      <nav className={`mobile-nav-drawer${isMobileMenuOpen ? " open" : ""}`} aria-label="Menu điều hướng">
        <div className="mobile-nav-header">
          <Link href="/" onClick={closeMenu}>
            <img src="/logo.png" alt="HBN Tech Store" className="mobile-nav-logo" />
          </Link>
          <button className="mobile-nav-close" onClick={closeMenu} aria-label="Đóng menu">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="mobile-search-wrapper">
          <form onSubmit={handleSearch} className="mobile-search-form">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Tìm kiếm">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>

        <div className="mobile-nav-links">
          <Link href="/products" onClick={closeMenu}><i className="fa-solid fa-box"></i> Sản phẩm</Link>
          <Link href="/products?sort=bestseller" onClick={closeMenu}><i className="fa-solid fa-fire"></i> Bán chạy nhất</Link>
          <Link href="/products?sort=newest" onClick={closeMenu}><i className="fa-solid fa-star"></i> Hàng mới về</Link>
          <Link href="/products?sale=true" onClick={closeMenu}><i className="fa-solid fa-tag"></i> Khuyến mãi</Link>

          <div className="mobile-nav-divider" />

          {session ? (
            <>
              <Link href="/profile" onClick={closeMenu}><i className="fa-solid fa-user-gear"></i> Thông tin cá nhân</Link>
              <Link href="/orders" onClick={closeMenu}><i className="fa-solid fa-clock-rotate-left"></i> Lịch sử đơn hàng</Link>
              <Link href="/cart" onClick={closeMenu}>
                <i className="fa-solid fa-cart-shopping"></i> Giỏ hàng {mounted && totalItems > 0 && `(${totalItems})`}
              </Link>
              {session.user.role === "admin" && (
                <Link href="/admin" onClick={closeMenu} className="mobile-nav-admin">
                  <i className="fa-solid fa-gauge"></i> Quản trị
                </Link>
              )}
              <div className="mobile-nav-divider" />
              <button
                className="mobile-nav-logout"
                onClick={() => { closeMenu(); if (window.confirm("Bạn có muốn đăng xuất không?")) signOut(); }}
              >
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={closeMenu}><i className="fa-regular fa-user"></i> Đăng nhập</Link>
              <Link href="/register" onClick={closeMenu}><i className="fa-solid fa-user-plus"></i> Đăng ký</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
