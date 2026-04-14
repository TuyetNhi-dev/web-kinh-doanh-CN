"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import './admin.css';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { name: 'Dashboard', icon: 'fa-solid fa-chart-line', path: '/admin' },
    { name: 'Sản phẩm', icon: 'fa-solid fa-box', path: '/admin/products' },
    { name: 'Đơn hàng', icon: 'fa-solid fa-cart-shopping', path: '/admin/orders' },
    { name: 'Khách hàng', icon: 'fa-solid fa-users', path: '/admin/users' },
    { name: 'Cài đặt', icon: 'fa-solid fa-gear', path: '/admin/settings' },
  ];

  return (
    <div className="admin-body">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <h2>TECH STORE</h2>
          </Link>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`admin-nav-item ${pathname === item.path ? 'active' : ''}`}
            >
              <i className={item.icon}></i>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="admin-nav" style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="admin-nav-item" 
            style={{ background: 'none', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{navItems.find(item => item.path === pathname)?.name || 'Admin'}</h1>
            <p style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>
              Chào mừng trở lại, {session?.user?.name || 'Admin'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative' }}>
              <i className="fa-regular fa-bell" style={{ fontSize: '1.2rem', color: 'var(--admin-text-muted)' }}></i>
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#f43f5e', color: '#fff', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>5</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#fff', padding: '5px 15px', borderRadius: '30px', border: '1px solid var(--admin-border)' }}>
              <div style={{ width: '32px', height: '32px', background: 'var(--admin-primary)', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {session?.user?.name?.charAt(0) || 'A'}
              </div>
              <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{session?.user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
