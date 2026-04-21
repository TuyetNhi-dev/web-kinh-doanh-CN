"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FlashSale({ products }) {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num) => num.toString().padStart(2, '0');

  // Lọc sản phẩm đang chạy Flash Sale
  const saleProducts = products.filter(p => p.is_flash_sale);

  if (saleProducts.length === 0) return null;

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-header">
        <div className="flash-sale-title">
          <img src="https://logodix.com/logo/2015093.png" alt="Flash Sale" style={{ filter: 'brightness(0) invert(1)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>KẾT THÚC TRONG</h2>
          <div className="countdown">
            <span className="countdown-box">{formatNum(timeLeft.h)}</span>
            <span style={{ fontWeight: 'bold' }}>:</span>
            <span className="countdown-box">{formatNum(timeLeft.m)}</span>
            <span style={{ fontWeight: 'bold' }}>:</span>
            <span className="countdown-box">{formatNum(timeLeft.s)}</span>
          </div>
        </div>
        <Link href="/products" style={{ color: '#fff', fontWeight: 'bold', fontSize: '0.9rem' }}>XEM TẤT CẢ <i className="fa-solid fa-chevron-right"></i></Link>
      </div>

      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {saleProducts.map((product, index) => (
          <div key={product.id} style={{ position: 'relative' }}>
            <Link href={`/products/${product.id}`} className="product-card glass" style={{ display: 'block', textDecoration: 'none', padding: '15px' }}>
              <div className="sale-badge">-{product.discount_percent || 10}%</div>
              
              <div style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                {product.image_url ? (
                  <img src={product.image_url} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                ) : (
                  <i className={product.category === 'Smartphone' ? 'fa-solid fa-mobile-screen' : 'fa-solid fa-laptop'} style={{ fontSize: '4rem', color: '#444' }}></i>
                )}
              </div>

              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', color: '#333', marginBottom: '10px', height: '40px', overflow: 'hidden' }}>{product.name}</h3>
              <p style={{ color: 'var(--brand-orange)', fontWeight: '800', fontSize: '1.2rem', marginBottom: '10px' }}>
                {parseFloat(product.price * (1 - (product.discount_percent || 10) / 100)).toLocaleString('vi-VN')} đ
              </p>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${80 - index * 15}%` }}></div>
              </div>
              <p className="sold-text">ĐÃ BÁN {20 + index * 12}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
