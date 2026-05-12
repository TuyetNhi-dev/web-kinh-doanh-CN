"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  { value: "all",        label: "Tất Cả" },
  { value: "Laptop",     label: "Laptop & MacBook" },
  { value: "Smartphone", label: "Smartphone" },
  { value: "Phụ kiện",   label: "Phụ Kiện Chính Hãng" },
  { value: "Smartwatch", label: "Smartwatch" },
];

const PRICE_RANGES = [
  { label: "Dưới 10 triệu",  min: 0,        max: 10000000 },
  { label: "10 - 20 triệu",  min: 10000000, max: 20000000 },
  { label: "20 - 40 triệu",  min: 20000000, max: 40000000 },
  { label: "Trên 40 triệu",  min: 40000000, max: null },
];

function getPageTitle(searchKeyword, sortParam, saleParam) {
  if (searchKeyword)             return `Kết quả: "${searchKeyword}"`;
  if (sortParam === "bestseller") return "Sản Phẩm Bán Chạy Nhất";
  if (sortParam === "newest")     return "Hàng Mới Về";
  if (saleParam === "true")       return "Khuyến Mãi Siêu Khủng";
  return "Tất Cả Sản Phẩm";
}

function FilterSidebar({ selectedCategory, selectedPrice, onCategoryClick, onPriceToggle, onReset, onClose }) {
  const hasFilter = selectedCategory !== "all" || selectedPrice !== null;

  return (
    <>
      <div className="filter-close-row">
        <strong>Bộ lọc</strong>
        <button className="filter-close-btn" onClick={onClose} aria-label="Đóng bộ lọc">
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <h3 className="sidebar-widget-title">Danh Mục</h3>
      <ul className="filter-list">
        {CATEGORIES.map((cat) => (
          <li key={cat.value}>
            <button
              className={`filter-category-btn${selectedCategory === cat.value ? " active" : ""}`}
              onClick={() => onCategoryClick(cat.value)}
            >
              {selectedCategory === cat.value && "› "}{cat.label}
            </button>
          </li>
        ))}
      </ul>

      <h3 className="sidebar-widget-title" style={{ marginTop: "24px" }}>Mức Giá</h3>
      <ul className="filter-list">
        {PRICE_RANGES.map((range, i) => (
          <li key={i}>
            <label>
              <input type="checkbox" checked={selectedPrice === i} onChange={() => onPriceToggle(i)} />
              {range.label}
            </label>
          </li>
        ))}
      </ul>

      {hasFilter && (
        <button className="filter-reset-btn" onClick={onReset}>
          Xóa bộ lọc
        </button>
      )}
    </>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const searchKeyword = searchParams.get("search");
  const sortParam     = searchParams.get("sort");
  const saleParam     = searchParams.get("sale");

  const [products, setProducts]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice]       = useState(null);
  const [isSidebarOpen, setIsSidebarOpen]       = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (selectedPrice !== null) {
        const range = PRICE_RANGES[selectedPrice];
        params.set("minPrice", range.min);
        if (range.max !== null) params.set("maxPrice", range.max);
      }
      if (searchKeyword) params.set("search", searchKeyword);
      if (sortParam)     params.set("sort", sortParam);
      if (saleParam)     params.set("sale", saleParam);

      const res  = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedPrice, searchKeyword, sortParam, saleParam]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isSidebarOpen]);

  const handleCategoryClick = (value) => {
    setSelectedCategory(value);
    setSelectedPrice(null);
    setIsSidebarOpen(false);
  };

  const handlePriceToggle = (index) => {
    setSelectedPrice((prev) => (prev === index ? null : index));
  };

  const handleReset = () => {
    setSelectedCategory("all");
    setSelectedPrice(null);
    setIsSidebarOpen(false);
  };

  const hasFilter = selectedCategory !== "all" || selectedPrice !== null;

  return (
    <div className="container products-page">
      <h1 className="products-page-title">
        {getPageTitle(searchKeyword, sortParam, saleParam)}
      </h1>

      {/* Nút lọc (chỉ hiện trên mobile) */}
      <div className="products-toolbar">
        <button className="filter-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
          <i className="fa-solid fa-sliders"></i>
          Bộ lọc {hasFilter && "(đang lọc)"}
        </button>
        {hasFilter && (
          <button className="filter-clear-btn" onClick={handleReset}>
            Xóa lọc
          </button>
        )}
      </div>

      {/* Overlay cho mobile drawer */}
      <div
        className={`filter-sidebar-overlay${isSidebarOpen ? " open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="catalog-container" style={{ padding: 0 }}>
        {/* Sidebar (desktop: sticky, mobile: drawer) */}
        <aside className={`glass catalog-sidebar${isSidebarOpen ? " mobile-open" : ""}`}>
          <FilterSidebar
            selectedCategory={selectedCategory}
            selectedPrice={selectedPrice}
            onCategoryClick={handleCategoryClick}
            onPriceToggle={handlePriceToggle}
            onReset={handleReset}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>

        {/* Product Grid */}
        <div className="catalog-main">
          {loading ? (
            <div className="products-state">
              <i className="fa-solid fa-spinner fa-spin products-state-icon"></i>
              <p>Đang tải sản phẩm...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="products-state">
              <i className="fa-solid fa-box-open products-state-icon empty"></i>
              <p>Không tìm thấy sản phẩm nào phù hợp.</p>
            </div>
          ) : (
            <div className="product-grid" style={{ padding: 0 }}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container products-loading">Đang tải...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
