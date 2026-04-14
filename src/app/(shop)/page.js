"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import CategorySidebar from '@/components/CategorySidebar';
import HeroSlider from '@/components/HeroSlider';
import FlashSale from '@/components/FlashSale';
import ProductCard from '@/components/ProductCard';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error('Lỗi fetch sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div style={{ background: '#f8f9fa' }}>
      <div className="container" style={{ paddingTop: '20px' }}>
        
        {/* HERO SECTION GRID */}
        <div className="hero-section-grid">
           <CategorySidebar />
           <HeroSlider />
        </div>

        {/* FLASH SALE SECTION */}
        {!loading && <FlashSale products={products} />}

        {/* Promo Small Banners */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '60px' }}>
           <div className="glass" style={{ height: '150px', background: 'linear-gradient(135deg, #111, #333)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '30px', color: '#fff' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>iPhone 15 Pro</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Thu cũ đổi mới - Giá tốt nhất</p>
                <button style={{ marginTop: '10px', background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '5px 15px', borderRadius: '20px', fontSize: '0.7rem' }}>CHI TIẾT</button>
              </div>
           </div>
           <div className="glass" style={{ height: '150px', background: 'linear-gradient(135deg, #f57224, #ff8a44)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '30px', color: '#fff' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Phụ Kiện Gaming</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Giảm ngay 200k khi mua Combo</p>
                <button style={{ marginTop: '10px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '5px 15px', borderRadius: '20px', fontSize: '0.7rem' }}>SĂN DEAL</button>
              </div>
           </div>
           <div className="glass" style={{ height: '150px', background: 'linear-gradient(135deg, #444, #000)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '30px', color: '#fff' }}>
              <div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Apple Watch Ultra</h4>
                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Trả góp 0% lãi suất</p>
                <button style={{ marginTop: '10px', background: 'transparent', color: '#fff', border: '1px solid #fff', padding: '5px 15px', borderRadius: '20px', fontSize: '0.7rem' }}>XEM NGAY</button>
              </div>
           </div>
        </div>

        {/* Featured Products */}
        <section style={{ paddingBottom: '80px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '10px' }}>Sản Phẩm Nổi Bật</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Khám phá các thiết bị công nghệ mới nhất vừa cập bến TechStore.</p>
            </div>
            <Link href="/products" style={{ fontWeight: 'bold', color: 'var(--brand-orange)', textDecoration: 'underline' }}>Xem tất cả</Link>
          </div>

          <div className="product-grid" style={{ padding: 0 }}>
            {loading ? (
              <p>Đang tải sản phẩm...</p>
            ) : products.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
