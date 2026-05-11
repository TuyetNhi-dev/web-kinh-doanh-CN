"use client";

import { useState, useEffect } from 'react';

export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBanner, setNewBanner] = useState({ image_url: '', title: '', subtitle: '', link: '' });

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    const res = await fetch('/api/admin/banners');
    const data = await res.json();
    setBanners(data);
    setLoading(false);
  }

  async function handleAdd() {
    if (!newBanner.image_url) return alert('Vui lòng nhập Link ảnh');
    const res = await fetch('/api/admin/banners', {
      method: 'POST',
      body: JSON.stringify(newBanner)
    });
    if (res.ok) {
      setNewBanner({ image_url: '', title: '', subtitle: '', link: '' });
      fetchBanners();
    }
  }

  async function handleDelete(id) {
    if (!confirm('Bạn có chắc muốn xóa banner này?')) return;
    const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
    if (res.ok) fetchBanners();
  }

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="admin-banners-page">
      <div className="admin-form" style={{ marginBottom: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Thêm Banner Mới</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="form-group">
            <label>Link hình ảnh (URL)</label>
            <input className="form-control" value={newBanner.image_url} onChange={e => setNewBanner({...newBanner, image_url: e.target.value})} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Tiêu đề</label>
            <input className="form-control" value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Phụ đề</label>
            <input className="form-control" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Link điều hướng</label>
            <input className="form-control" value={newBanner.link} onChange={e => setNewBanner({...newBanner, link: e.target.value})} placeholder="/products" />
          </div>
        </div>
        <button className="btn-indigo" onClick={handleAdd} style={{ marginTop: '10px' }}>+ THÊM BANNER</button>
      </div>

      <div className="admin-table-container">
         <table className="admin-table">
           <thead>
             <tr>
               <th>Hình ảnh</th>
               <th>Thông tin</th>
               <th>Link</th>
               <th>Thao tác</th>
             </tr>
           </thead>
           <tbody>
             {banners.map(banner => (
               <tr key={banner.id}>
                 <td><img src={banner.image_url} style={{ width: '120px', borderRadius: '4px' }} /></td>
                 <td>
                   <strong>{banner.title}</strong>
                   <p style={{ fontSize: '0.8rem', color: '#888' }}>{banner.subtitle}</p>
                 </td>
                 <td>{banner.link || '---'}</td>
                 <td>
                   <button className="btn" onClick={() => handleDelete(banner.id)} style={{ color: '#f43f5e' }}><i className="fa-solid fa-trash"></i></button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}
