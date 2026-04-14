"use client";

import { useCartStore } from '@/store/useCartStore';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

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
    <motion.div 
      className="product-card glass"
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="product-card-badge">Mới</div>
      
      <div className="product-card-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
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
            {parseFloat(product.price).toLocaleString('vi-VN')} đ
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
  );
}
