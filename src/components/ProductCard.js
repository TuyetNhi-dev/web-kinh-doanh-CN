"use client";

import React, { useCallback } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const getOptimizedImageUrl = (url) => {
  if (!url) return url;
  try {
    const hasQuery = url.includes('?');
    return `${url}${hasQuery ? '&' : '?'}f_auto,q_auto,w_500`;
  } catch {
    return url;
  }
};

const getIcon = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('macbook') || n.includes('laptop')) return 'fa-solid fa-laptop';
  if (n.includes('iphone') || n.includes('phone')) return 'fa-solid fa-mobile-screen-button';
  if (n.includes('watch')) return 'fa-solid fa-clock';
  if (n.includes('tai nghe') || n.includes('sony')) return 'fa-solid fa-headphones';
  return 'fa-solid fa-box-archive';
};

function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      addToCart(product);
      toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`, {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        iconTheme: {
          primary: 'var(--brand-orange)',
          secondary: '#fff',
        },
      });
    },
    [addToCart, product]
  );

  const imageUrl = product.image_url ? getOptimizedImageUrl(product.image_url) : null;
  const hasDiscount = product.discount_percent || product.is_flash_sale;
  const salePrice = hasDiscount
    ? parseFloat(product.price * (1 - (product.discount_percent || 10) / 100))
    : parseFloat(product.price);

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div className="product-card glass">
        <div className="product-card-badge">Mới</div>

        <div className="product-card-image">
          {imageUrl ? (
            <div className="product-card-image-wrapper">
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 280px"
                style={{ objectFit: 'cover', borderRadius: '16px' }}
                priority={false}
              />
            </div>
          ) : (
            <div className="product-card-placeholder">
              <i className={getIcon(product.name)}></i>
            </div>
          )}
        </div>

        <div className="product-card-body">
          <div className="product-card-category">Công nghệ</div>
          <h3 className="product-card-name" title={product.name}>
            {product.name}
          </h3>

          <p className="product-card-description">
            {product.description || 'Sản phẩm chất lượng cao từ HBN TechStore.'}
          </p>

          <div className="product-card-footer">
            <div className="product-card-price">
              {hasDiscount ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.1rem', color: 'var(--brand-orange)', fontWeight: 'bold' }}>
                    {salePrice.toLocaleString('vi-VN')} đ
                  </span>
                  <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: '#999', fontWeight: 'normal' }}>
                    {parseFloat(product.price).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ) : (
                <span>{salePrice.toLocaleString('vi-VN')} đ</span>
              )}
            </div>
            <button className="product-card-btn" type="button" onClick={handleAddToCart}>
              <i className="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default React.memo(ProductCard, (prev, next) => prev.product.id === next.product.id && prev.product.price === next.product.price && prev.product.image_url === next.product.image_url);
