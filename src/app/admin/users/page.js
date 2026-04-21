"use client";

import { useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Lỗi lấy người dùng:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function updateRole(id, role) {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role }),
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, role } : u));
      }
    } catch (error) {
      console.error('Lỗi cập nhật vai trò:', error);
    }
  }

  async function deleteUser(id) {
    if (!confirm('Bạn có chắc muốn xóa người dùng này? Hành động không thể hoàn tác.')) return;
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (error) {
      console.error('Lỗi xóa người dùng:', error);
    }
  }

  const filtered = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải danh sách...</div>;

  return (
    <div className="admin-table-container">
      <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Quản lý Người dùng ({users.length})</h2>
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--admin-border)', fontSize: '0.9rem', minWidth: '260px', outline: 'none' }}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Đơn hàng</th>
            <th>Tổng chi tiêu</th>
            <th>Ngày đăng ký</th>
            <th>Vai trò</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
                Không tìm thấy người dùng nào
              </td>
            </tr>
          ) : filtered.map((user) => (
            <tr key={user.id}>
              <td style={{ fontWeight: '700', color: 'var(--admin-primary)' }}>#{user.id}</td>
              <td style={{ fontWeight: '600' }}>{user.full_name || '—'}</td>
              <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.9rem' }}>{user.email}</td>
              <td style={{ textAlign: 'center' }}>{user.order_count}</td>
              <td style={{ fontWeight: '700', color: 'var(--admin-primary)' }}>
                {parseFloat(user.total_spent).toLocaleString('vi-VN')} đ
              </td>
              <td style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                {new Date(user.created_at).toLocaleDateString('vi-VN')}
              </td>
              <td>
                <span style={{
                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                  background: user.role === 'admin' ? '#ede9fe' : '#f0fdf4',
                  color: user.role === 'admin' ? '#7c3aed' : '#059669',
                }}>
                  {user.role === 'admin' ? 'Admin' : 'Khách hàng'}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={user.role}
                    onChange={e => updateRole(user.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--admin-border)', fontSize: '0.85rem', background: '#fff', cursor: 'pointer' }}
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                    title="Xóa người dùng"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
