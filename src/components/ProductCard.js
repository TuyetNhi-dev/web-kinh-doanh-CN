"use client";

import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  // Simple icon mapping based on product name/category if images are missing
  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('macbook') || n.includes('laptop')) return 'fa-solid fa-laptop';
    if (n.includes('iphone') || n.includes('phone')) return 'fa-solid fa-mobile-screen-button';
    if (n.includes('watch')) return 'fa-solid fa-clock';
    if (n.includes('tai nghe') || n.includes('sony')) return 'fa-solid fa-headphones';
    return 'fa-solid fa-box-archive';
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
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
  };

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <motion.div 
        className="product-card glass"
        whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="product-card-badge">Mới</div>
        
        <div className="product-card-image">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} />
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
            {product.description || "Sản phẩm chất lượng cao từ HBN TechStore."}
          </p>

          <div className="product-card-footer">
            <div className="product-card-price">
              {product.discount_percent || product.is_flash_sale ? (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.1rem', color: 'var(--brand-orange)', fontWeight: 'bold' }}>
                    {parseFloat(product.price * (1 - (product.discount_percent || 10) / 100)).toLocaleString('vi-VN')} đ
                  </span>
                  <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: '#999', fontWeight: 'normal' }}>
                    {parseFloat(product.price).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              ) : (
                <span>{parseFloat(product.price).toLocaleString('vi-VN')} đ</span>
              )}
            </div>
            
            <button 
              className="product-card-btn"
              onClick={handleAddToCart}
            >
              <i className="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
