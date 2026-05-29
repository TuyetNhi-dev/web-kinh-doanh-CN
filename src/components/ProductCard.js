"use client";

import React, { useCallback } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import useWishlistStore from '@/store/useWishlistStore';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  const addToCart       = useCartStore((state) => state.addToCart);
  const isWishlisted    = useWishlistStore((s) => s.isWishlisted);
  const toggleWishlist  = useWishlistStore((s) => s.toggleWishlist);
  const fetchWishlist   = useWishlistStore((s) => s.fetchWishlist);
  const { data: session } = useSession();
  const router          = useRouter();

  // Hydrate wishlist when first rendered (no-op if already hydrated)
  React.useEffect(() => {
    if (session) fetchWishlist();
  }, [session, fetchWishlist]);

  const handleWishlist = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!session) {
        router.push("/login?callbackUrl=/wishlist");
        return;
      }
      const result = await toggleWishlist(product);
      if (result?.needsLogin) {
        router.push("/login?callbackUrl=/wishlist");
        return;
      }
      const wished = isWishlisted(product.id);
      toast(wished ? `Đã thêm vào yêu thích` : `Đã xoá khỏi yêu thích`, {
        icon: wished ? "❤️" : "🤍",
        style: { borderRadius: "10px", background: "#333", color: "#fff" },
      });
    },
    [session, router, toggleWishlist, isWishlisted, product]
  );

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

        {/* Wishlist heart */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted(product.id) ? "Xoá khỏi yêu thích" : "Thêm vào yêu thích"}
          style={{
            position: "absolute", top: "10px", right: "10px", zIndex: 2,
            background: "rgba(255,255,255,0.85)", border: "none", borderRadius: "50%",
            width: "34px", height: "34px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.95rem", transition: "transform 0.15s",
            color: isWishlisted(product.id) ? "#ef4444" : "#aaa",
          }}
        >
          <i className={isWishlisted(product.id) ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
        </button>

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
