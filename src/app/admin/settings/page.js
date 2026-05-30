"use client";

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data) {
          setForm({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
          });
        }
      } catch (error) {
        console.error('Lỗi lấy cài đặt:', error);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('Lưu cài đặt thành công');
      } else {
        toast.error('Lưu cài đặt thất bại');
      }
    } catch (error) {
      console.error('Lỗi lưu cài đặt:', error);
      toast.error('Lỗi server');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="admin-table-container" style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '24px' }}>Cài đặt cửa hàng</h2>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>Tên cửa hàng</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="form-control"
              placeholder="Ví dụ: HBN TechStore"
            />
          </div>
          <div className="form-group">
            <label>Email liên hệ</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="form-control"
              placeholder="contact@techstore.vn"
            />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="form-control"
              placeholder="0901234567"
            />
          </div>
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button type="submit" className="btn-indigo" disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
