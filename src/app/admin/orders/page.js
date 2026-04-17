"use client";

import { useEffect, useState } from 'react';

const statusOptions = ['pending', 'processing', 'completed', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data || []);
    } catch (error) {
      console.error('Lỗi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, status) {
    setSavingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      } else {
        console.error('Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải đơn hàng...</div>;

  return (
    <div className="admin-table-container">
      <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Quản lý Đơn hàng ({orders.length})</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Ngày</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ fontWeight: '600' }}>#{order.id}</td>
              <td>{order.customer_name || order.full_name || 'Khách vãng lai'}</td>
              <td>{new Date(order.created_at).toLocaleString('vi-VN')}</td>
              <td style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>{order.total_amount?.toLocaleString('vi-VN')} đ</td>
              <td>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  background: order.status === 'completed' ? '#d1fae5' : order.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                  color: order.status === 'completed' ? '#059669' : order.status === 'cancelled' ? '#b91c1c' : '#d97706'
                }}>
                  {order.status}
                </span>
              </td>
              <td>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  disabled={savingId === order.id}
                  style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: '#fff' }}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
