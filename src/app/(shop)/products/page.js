"use client";

import { useEffect, useState, useCallback } from 'react';
import { useCartStore } from '@/store/useCartStore';
import ProductCard from '@/components/ProductCard';

const CATEGORIES = [
  { value: 'all', label: 'Tất Cả' },
  { value: 'Laptop', label: 'Laptop & MacBook' },
  { value: 'Smartphone', label: 'Smartphone' },
  { value: 'Phụ kiện', label: 'Phụ Kiện Chính Hãng' },
  { value: 'Smartwatch', label: 'Smartwatch' },
];

const PRICE_RANGES = [
  { label: 'Dưới 10 triệu', min: 0, max: 10000000 },
  { label: '10 - 20 triệu', min: 10000000, max: 20000000 },
  { label: '20 - 40 triệu', min: 20000000, max: 40000000 },
  { label: 'Trên 40 triệu', min: 40000000, max: null },
];

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedPrice !== null) {
        const range = PRICE_RANGES[selectedPrice];
        params.set('minPrice', range.min);
        if (range.max !== null) params.set('maxPrice', range.max);
      }
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Lỗi fetch sản phẩm:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleCategoryClick(value) {
    setSelectedCategory(value);
    setSelectedPrice(null);
  }

  function handlePriceToggle(index) {
    setSelectedPrice(prev => prev === index ? null : index);
  }

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Tất Cả Sản Phẩm</h1>

      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Sidebar Filter */}
        <aside className="glass" style={{ minWidth: '220px', padding: '20px', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '15px' }}>Danh Mục</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {CATEGORIES.map(cat => (
              <li key={cat.value}>
                <button
                  onClick={() => handleCategoryClick(cat.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: selectedCategory === cat.value ? 'var(--accent-color)' : 'inherit',
                    fontWeight: selectedCategory === cat.value ? '700' : '400',
                    padding: '4px 0',
                    fontSize: '0.95rem',
                    textAlign: 'left',
                  }}
                >
                  {selectedCategory === cat.value && '› '}{cat.label}
                </button>
              </li>
            ))}
          </ul>

          <h3 style={{ margin: '24px 0 15px' }}>Mức Giá</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PRICE_RANGES.map((range, i) => (
              <li key={i}>
                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={selectedPrice === i}
                    onChange={() => handlePriceToggle(i)}
                  />
                  {range.label}
                </label>
              </li>
            ))}
          </ul>

          {(selectedCategory !== 'all' || selectedPrice !== null) && (
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedPrice(null); }}
              style={{ marginTop: '20px', width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', background: 'transparent', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Xóa bộ lọc
            </button>
          )}
        </aside>

        {/* Product Grid */}
        {loading ? (
          <div style={{ flex: 1, textAlign: 'center', padding: '100px' }}>
            <p>Đang tải sản phẩm...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ flex: 1, textAlign: 'center', padding: '100px', color: 'var(--text-secondary)' }}>
            <p>Không tìm thấy sản phẩm nào phù hợp.</p>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
