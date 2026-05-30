"use client";

import { useState, useEffect } from 'react';

export default function AdminPromos() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromos();
  }, []);

  async function fetchPromos() {
    const res = await fetch('/api/admin/promos');
    const data = await res.json();
    setPromos(data);
    setLoading(false);
  }

  async function handleUpdate(id, field, value) {
    const p = promos.find(item => item.id === id);
    const updated = { ...p, [field]: value };
    const res = await fetch('/api/admin/promos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    if (res.ok) fetchPromos();
  }

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="admin-promos-page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {promos.map((promo, index) => (
          <div key={promo.id} className="admin-form" style={{ border: '1px solid #ddd' }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--brand-orange)' }}>Khuyến mãi #{index + 1}</h3>
            
            <div className="form-group">
               <label>Tiêu đề chính</label>
               <input className="form-control" defaultValue={promo.title} onBlur={e => handleUpdate(promo.id, 'title', e.target.value)} />
            </div>

            <div className="form-group">
               <label>Phụ đề / Mô tả ngắn</label>
               <input className="form-control" defaultValue={promo.subtitle} onBlur={e => handleUpdate(promo.id, 'subtitle', e.target.value)} />
            </div>

            <div className="form-group">
               <label>Màu nền (Gradient CSS)</label>
               <input className="form-control" defaultValue={promo.gradient} onBlur={e => handleUpdate(promo.id, 'gradient', e.target.value)} />
               <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>VD: linear-gradient(135deg, #111, #333)</p>
            </div>

            <div className="form-group">
               <label>Chữ trên nút</label>
               <input className="form-control" defaultValue={promo.button_text} onBlur={e => handleUpdate(promo.id, 'button_text', e.target.value)} />
            </div>

            <div className="form-group">
               <label>Link điều hướng</label>
               <input className="form-control" defaultValue={promo.link} onBlur={e => handleUpdate(promo.id, 'link', e.target.value)} />
            </div>

            <div style={{ padding: '15px', background: promo.gradient, color: '#fff', borderRadius: '8px', marginTop: '20px' }}>
               <strong>Xem thử:</strong>
               <h4>{promo.title}</h4>
               <p style={{ fontSize: '0.8rem' }}>{promo.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
