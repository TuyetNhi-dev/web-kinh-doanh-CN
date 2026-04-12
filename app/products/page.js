"use client";

import { useEffect, useState } from 'react';
import { useCartStore } from '../../lib/useCartStore';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Lỗi fetch sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Tất Cả Sản Phẩm</h1>
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Bộ Lọc (Sidebar) */}
        <aside className="glass" style={{ minWidth: '250px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Danh Mục</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="#" style={{ color: 'var(--accent-color)' }}>Tất Cả</a></li>
            <li><a href="#">Laptop & MacBook</a></li>
            <li><a href="#">Smartphone</a></li>
            <li><a href="#">Phụ Kiện Chính Hãng</a></li>
            <li><a href="#">Smartwatch</a></li>
          </ul>

          <h3 style={{ margin: '30px 0 15px' }}>Mức Giá</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><label><input type="checkbox"/> Dưới 10 triệu</label></li>
            <li><label><input type="checkbox"/> 10 - 20 triệu</label></li>
            <li><label><input type="checkbox"/> 20 - 40 triệu</label></li>
            <li><label><input type="checkbox"/> Trên 40 triệu</label></li>
          </ul>
        </aside>

        {/* Lưới Sản Phẩm */}
        {loading ? (
            <div style={{ flex: 1, textAlign: 'center', padding: '100px' }}>
                <p>Đang tải sản phẩm...</p>
            </div>
        ) : !Array.isArray(products) ? (
            <div style={{ flex: 1, textAlign: 'center', padding: '100px', color: 'var(--pv-red, #ff4d4d)' }}>
                <p>Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>Lỗi: {products?.message || 'Không xác định'}</p>
            </div>
        ) : (
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
            {products.map(product => (
                <div key={product.id} className="product-card glass">
                <a href={`/products/${product.id}`}>
                    <div className="product-icon">
                    <i className="fa-solid fa-laptop"></i> 
                    {/* Placeholder icon since we don't have icons in DB yet */}
                    </div>
                    <h3 className="product-name" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                    <p className="product-price">{formatPrice(product.price)}</p>
                </a>
                <button 
                    className="btn btn-primary" 
                    style={{width: '100%', marginTop: '15px'}}
                    onClick={() => {
                        addToCart(product);
                        alert(`Đã thêm ${product.name} vào giỏ hàng!`);
                    }}
                >
                    <i className="fa-solid fa-cart-shopping"></i> Thêm vào giỏ
                </button>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
