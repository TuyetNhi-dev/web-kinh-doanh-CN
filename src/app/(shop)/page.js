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
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, promoRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/promos')
        ]);
        const prodData = await prodRes.json();
        const promoData = await promoRes.json();
        if (Array.isArray(prodData)) setProducts(prodData);
        if (Array.isArray(promoData)) setPromos(promoData);
      } catch (error) {
        console.error('Lỗi fetch dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

        {/* Promo Small Banners (Bento Grid) */}
        {!loading && promos.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '60px' }}>
             {promos.map(promo => (
               <Link key={promo.id} href={promo.link || '/products'}>
                 <div className="glass" style={{ height: '150px', background: promo.gradient, borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '30px', color: '#fff', cursor: 'pointer' }}>
                   <div>
                     <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{promo.title}</h4>
                     <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{promo.subtitle}</p>
                     <button style={{ marginTop: '10px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.7rem' }}>
                       {promo.button_text || 'XEM NGAY'}
                     </button>
                   </div>
                 </div>
               </Link>
             ))}
          </div>
        )}

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
