"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import "./admin.css";

const NAV_ITEMS = [
  { name: "Dashboard",       icon: "fa-solid fa-chart-line",    path: "/admin" },
  { name: "Doanh thu",       icon: "fa-solid fa-money-bill-trend-up", path: "/admin/revenue" },
  { name: "Sản phẩm",        icon: "fa-solid fa-box",           path: "/admin/products" },
  { name: "Quản lý Slider",  icon: "fa-solid fa-image",         path: "/admin/banners" },
  { name: "Flash Sale",      icon: "fa-solid fa-bolt",          path: "/admin/flash-sale" },
  { name: "Khuyến mãi Bento",icon: "fa-solid fa-grid-2",        path: "/admin/promos" },
  { name: "Đơn hàng",        icon: "fa-solid fa-cart-shopping", path: "/admin/orders" },
  { name: "Khách hàng",      icon: "fa-solid fa-users",         path: "/admin/users" },
  { name: "Cài đặt",         icon: "fa-solid fa-gear",          path: "/admin/settings" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pageTitle = NAV_ITEMS.find((item) => item.path === pathname)?.name || "Admin";

  // Khoá scroll khi sidebar mobile mở
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  // Đóng sidebar khi navigate
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="admin-body">
      {/* Overlay (mobile) */}
      <div
        className={`admin-sidebar-overlay${isSidebarOpen ? " open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar${isSidebarOpen ? " open" : ""}`}>
        <div className="admin-logo">
          <Link href="/" style={{ textDecoration: "none" }}>
            <h2>HBN TECH STORE</h2>
          </Link>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`admin-nav-item${pathname === item.path ? " active" : ""}`}
            >
              <i className={item.icon}></i>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-nav" style={{ marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="admin-nav-item"
            style={{ background: "none", border: "none", width: "100%", cursor: "pointer", textAlign: "left" }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {/* Hamburger — chỉ hiện trên mobile */}
            <button
              className="admin-menu-btn"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Mở menu quản trị"
            >
              <i className="fa-solid fa-bars"></i>
            </button>
            <div>
              <h1>{pageTitle}</h1>
              <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem" }}>
                Chào mừng trở lại, {session?.user?.name || "Admin"}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", padding: "5px 15px", borderRadius: "30px", border: "1px solid var(--admin-border)" }}>
              <div style={{ width: "32px", height: "32px", background: "var(--admin-primary)", borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>
                {session?.user?.name?.charAt(0) || "A"}
              </div>
              <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>{session?.user?.name || "Admin"}</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
