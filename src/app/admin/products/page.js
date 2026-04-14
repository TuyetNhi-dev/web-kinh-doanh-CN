"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Lỗi lấy danh sách sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Lỗi xóa sản phẩm:', error);
    }
  }

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải danh sách...</div>;

  return (
    <div className="admin-table-container">
      <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Tất cả Sản phẩm ({products.length})</h2>
        <Link href="/admin/products/new" className="btn-indigo" style={{ textDecoration: 'none' }}>
          <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i>
          Thêm sản phẩm
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá bán</th>
            <th>Tồn kho</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div style={{ width: '50px', height: '50px', background: '#f8fafc', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                  <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </td>
              <td>
                <div style={{ fontWeight: '600', color: 'var(--admin-text-main)' }}>{product.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  {product.description}
                </div>
              </td>
              <td>
                <span style={{ padding: '4px 8px', background: '#e0e7ff', color: '#6366f1', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600' }}>
                  {product.category}
                </span>
              </td>
              <td style={{ fontWeight: '700', color: 'var(--admin-primary)' }}>
                {parseFloat(product.price).toLocaleString('vi-VN')} đ
              </td>
              <td>
                <div style={{ fontWeight: '600', color: product.stock_quantity > 0 ? '#059669' : '#dc2626' }}>
                  {product.stock_quantity}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button style={{ color: 'var(--admin-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button 
                    onClick={() => deleteProduct(product.id)}
                    style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
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
