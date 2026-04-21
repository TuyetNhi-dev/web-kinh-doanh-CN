"use client";

import { useEffect, useState } from 'react';

const STATUS_LABELS = {
  pending: { label: 'Chờ xử lý', color: '#f59e0b', bg: '#fef3c7' },
  processing: { label: 'Đang xử lý', color: '#3b82f6', bg: '#dbeafe' },
  completed: { label: 'Hoàn thành', color: '#059669', bg: '#d1fae5' },
  cancelled: { label: 'Đã hủy', color: '#ef4444', bg: '#fee2e2' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  async function fetchOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateStatus(id, status) {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  }

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải đơn hàng...</div>;

  return (
    <div className="admin-table-container">
      <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Quản lý Đơn hàng ({orders.length})</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'pending', 'processing', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: filterStatus === s ? '700' : '400',
                background: filterStatus === s ? 'var(--admin-primary)' : '#f1f5f9',
                color: filterStatus === s ? '#fff' : 'var(--admin-text-main)',
                fontSize: '0.85rem',
              }}
            >
              {s === 'all' ? 'Tất cả' : STATUS_LABELS[s]?.label}
              {' '}
              <span style={{ opacity: 0.7 }}>
                ({s === 'all' ? orders.length : orders.filter(o => o.status === s).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Khách hàng</th>
            <th>Số sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Cập nhật</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                Không có đơn hàng nào
              </td>
            </tr>
          ) : filtered.map((order) => {
            const s = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
            return (
              <tr key={order.id}>
                <td style={{ fontWeight: '700', color: 'var(--admin-primary)' }}>#{order.id}</td>
                <td>
                  <div style={{ fontWeight: '600' }}>{order.full_name || 'Khách vãng lai'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>{order.email || ''}</div>
                </td>
                <td style={{ textAlign: 'center' }}>{order.item_count} sản phẩm</td>
                <td style={{ fontWeight: '700', color: 'var(--admin-primary)' }}>
                  {parseFloat(order.total_amount).toLocaleString('vi-VN')} đ
                </td>
                <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                  {new Date(order.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid var(--admin-border)', fontSize: '0.85rem', background: '#fff', cursor: 'pointer' }}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="processing">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
