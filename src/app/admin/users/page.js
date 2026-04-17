"use client";

import { useEffect, useState } from 'react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách khách hàng:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải khách hàng...</div>;

  return (
    <div className="admin-table-container">
      <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Quản lý Khách hàng ({users.length})</h2>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Ngày tham gia</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={{ fontWeight: '600' }}>{user.full_name || 'Không rõ'}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
