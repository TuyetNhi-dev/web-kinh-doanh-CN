"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.stats) {
          setStats(data.stats);
          setRecentOrders(data.recentOrders);
        }
      } catch (error) {
        console.error('Lỗi lấy dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải dữ liệu...</div>;

  const statCards = [
    { title: 'Doanh thu', value: parseFloat(stats?.totalRevenue || 0).toLocaleString('vi-VN') + ' đ', icon: 'fa-solid fa-money-bill-trend-up', color: 'emerald', href: '/admin/revenue' },
    { title: 'Đơn hàng', value: stats?.totalOrders, icon: 'fa-solid fa-cart-shopping', color: 'amber', href: '/admin/orders' },
    { title: 'Sản phẩm', value: stats?.totalProducts, icon: 'fa-solid fa-box', color: 'indigo', href: '/admin/products' },
    { title: 'Khách hàng', value: stats?.totalCustomers, icon: 'fa-solid fa-users', color: 'rose', href: '/admin/users' },
  ];

  return (
    <>
      {/* Stat Cards */}
      <div className="admin-stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card" onClick={() => router.push(card.href)} style={{ cursor: 'pointer' }}>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </div>
            <div className={`stat-icon ${card.color}`}>
              <i className={card.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="admin-table-container">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Đơn hàng mới nhất</h2>
          <button onClick={() => router.push('/admin/orders')} style={{ background: 'none', border: 'none', color: 'var(--admin-primary)', fontWeight: '600', cursor: 'pointer' }}>Xem tất cả</button>
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID Đơn</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <tr key={order.id}>
                <td style={{ fontWeight: '600' }}>#{order.id}</td>
                <td>{order.customer_name || 'Khách vãng lai'}</td>
                <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                <td style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>{parseFloat(order.total_amount || 0).toLocaleString('vi-VN')} đ</td>
                <td>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    background: order.status === 'completed' ? '#d1fae5' : '#fef3c7',
                    color: order.status === 'completed' ? '#059669' : '#d97706'
                  }}>
                    {order.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => router.push(`/admin/orders`)} style={{ color: 'var(--admin-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }} title="Xem đơn hàng">
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                  Chưa có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
