"use client";

import { useState, useEffect } from 'react';

export default function AdminFlashSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFlashSaleData();
  }, []);

  async function fetchFlashSaleData() {
    const res = await fetch('/api/admin/flash-sale');
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  async function handleToggle(id, isSale, discount, stock) {
    const res = await fetch('/api/admin/flash-sale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_flash_sale: isSale, discount_percent: discount, flash_sale_stock: stock })
    });
    if (res.ok) fetchFlashSaleData();
  }

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="admin-flash-sale-page">
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>Giá gốc</th>
              <th>Trạng thái</th>
              <th>Giảm giá (%)</th>
              <th>Kho Sale</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: '600' }}>{p.name}</td>
                <td>{p.price.toLocaleString('vi-VN')} đ</td>
                <td>
                   <span style={{ 
                     color: p.is_flash_sale ? '#f57224' : '#888',
                     fontWeight: 'bold',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '5px'
                   }}>
                     <i className="fa-solid fa-bolt"></i>
                     {p.is_flash_sale ? 'Đang Sale' : '---'}
                   </span>
                </td>
                <td>
                   <input 
                     type="number" 
                     defaultValue={p.discount_percent} 
                     onBlur={e => handleToggle(p.id, p.is_flash_sale, parseInt(e.target.value), p.flash_sale_stock)}
                     style={{ width: '60px', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                   /> %
                </td>
                <td>
                   <input 
                     type="number" 
                     defaultValue={p.flash_sale_stock} 
                     onBlur={e => handleToggle(p.id, p.is_flash_sale, p.discount_percent, parseInt(e.target.value))}
                     style={{ width: '60px', padding: '5px', border: '1px solid #ddd', borderRadius: '4px' }}
                   />
                </td>
                <td>
                  <button 
                    onClick={() => handleToggle(p.id, !p.is_flash_sale, p.discount_percent, p.flash_sale_stock)}
                    className="btn"
                    style={{ 
                      background: p.is_flash_sale ? '#f43f5e' : '#10b981', 
                      color: '#fff',
                      fontSize: '0.8rem',
                      padding: '5px 15px'
                    }}
                  >
                    {p.is_flash_sale ? 'TẮT SALE' : 'BẬT SALE'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
