"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setImagePreview(data?.image_url || null);
      } catch (error) {
        console.error('Lỗi lấy sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.url) {
        setProduct((current) => ({ ...current, image_url: data.url }));
      }
    } catch (error) {
      console.error('Lỗi upload ảnh:', error);
      alert('Lỗi upload ảnh, vui lòng thử lại!');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      if (res.ok) {
        router.push('/admin/products');
      } else {
        alert('Lỗi cập nhật sản phẩm');
      }
    } catch (error) {
      console.error('Lỗi lưu sản phẩm:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải sản phẩm...</div>;
  if (!product) return <div style={{ padding: '20px', textAlign: 'center' }}>Không tìm thấy sản phẩm.</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link href="/admin/products" style={{ textDecoration: 'none', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-arrow-left"></i>
          Quay lại danh sách
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h2 style={{ marginBottom: '25px', fontWeight: '700' }}>Chỉnh sửa sản phẩm</h2>

        <div className="form-group">
          <label>Tên sản phẩm *</label>
          <input
            type="text"
            required
            className="form-control"
            value={product.name || ''}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="form-group">
            <label>Danh mục</label>
            <select
              className="form-control"
              value={product.category || ''}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
            >
              <option value="Laptop">Laptop / Macbook</option>
              <option value="Smartphone">iPhone / Smartphone</option>
              <option value="Phụ Kiện">Phụ Kiện / Linh Kiện</option>
              <option value="Smartwatch">Smartwatch</option>
            </select>
          </div>
          <div className="form-group">
            <label>Số lượng tồn kho</label>
            <input
              type="number"
              required
              className="form-control"
              value={product.stock_quantity || 0}
              onChange={(e) => setProduct({ ...product, stock_quantity: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Giá bán (VNĐ) *</label>
          <input
            type="number"
            required
            className="form-control"
            value={product.price || 0}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea
            rows="4"
            className="form-control"
            value={product.description || ''}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Hình ảnh sản phẩm</label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
            <div className="upload-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <i className="fa-regular fa-image" style={{ fontSize: '2rem', color: '#ccc' }}></i>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-control"
                style={{ padding: '8px' }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--admin-border)', textAlign: 'right' }}>
          <Link href="/admin/products" style={{ marginRight: '20px', textDecoration: 'none', color: 'var(--admin-text-muted)', fontWeight: '600' }}>
            Hủy bỏ
          </Link>
          <button type="submit" className="btn-indigo" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Cập nhật sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
