"use client";

import { Suspense, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import VirtualizedProductGrid from "@/components/VirtualizedProductGrid";

const CATEGORIES = [
  { value: "all", label: "Tất Cả" },
  { value: "Laptop", label: "Laptop & MacBook" },
  { value: "Smartphone", label: "Smartphone" },
  { value: "Phụ kiện", label: "Phụ Kiện Chính Hãng" },
  { value: "Smartwatch", label: "Smartwatch" },
];

const PRICE_RANGES = [
  { label: "Dưới 10 triệu", min: 0, max: 10000000 },
  { label: "10 - 20 triệu", min: 10000000, max: 20000000 },
  { label: "20 - 40 triệu", min: 20000000, max: 40000000 },
  { label: "Trên 40 triệu", min: 40000000, max: null },
];

function getPageTitle(searchKeyword, sortParam, saleParam) {
  if (searchKeyword) return `Kết quả: "${searchKeyword}"`;
  if (sortParam === "bestseller") return "Sản Phẩm Bán Chạy Nhất";
  if (sortParam === "newest") return "Hàng Mới Về";
  if (saleParam === "true") return "Khuyến Mãi Siêu Khủng";
  return "Tất Cả Sản Phẩm";
}

function ProductGridSkeleton() {
  return (
    <div className="product-grid" style={{ padding: 0 }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className="product-card-skeleton glass" style={{ height: '350px', animation: 'pulse 1.5s infinite' }} />
      ))}
    </div>
  );
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
              {selectedCategory === cat.value && "› "}
              {cat.label}
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
  const searchKeyword = searchParams.get("search")?.trim() ?? "";
  const sortParam = searchParams.get("sort");
  const saleParam = searchParams.get("sale");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const observer = useRef();
  const abortControllerRef = useRef();

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice];
      params.set("minPrice", String(range.min));
      if (range.max !== null) params.set("maxPrice", String(range.max));
    }
    if (searchKeyword) params.set("search", searchKeyword);
    if (sortParam) params.set("sort", sortParam);
    if (saleParam) params.set("sale", saleParam);
    return params.toString();
  }, [selectedCategory, selectedPrice, searchKeyword, sortParam, saleParam]);

  const fetchProducts = useCallback(
    async (pageNum = 1, append = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      append ? setLoadingMore(true) : setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(queryString);
        params.set("page", String(pageNum));
        params.set("limit", "12");

        const response = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });

        if (!response.ok) {
          throw new Error("Không tải được dữ liệu sản phẩm.");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Dữ liệu sản phẩm không hợp lệ.");
        }

        setProducts((prev) => (append ? [...prev, ...data] : data));
        setHasMore(data.length === 12);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Lỗi tải sản phẩm.");
          if (!append) setProducts([]);
        }
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [queryString]
  );

  useEffect(() => {
    setPage(1);
  }, [queryString]);

  useEffect(() => {
    fetchProducts(page, page > 1);
    return () => abortControllerRef.current?.abort();
  }, [page, fetchProducts]);

  const lastProductRef = useCallback(
    (node) => {
      if (loadingMore || loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prev) => prev + 1);
          }
        },
        { rootMargin: "300px" }
      );
      if (node) observer.current.observe(node);
    },
    [hasMore, loading, loadingMore]
  );

  const pageTitle = useMemo(() => getPageTitle(searchKeyword, sortParam, saleParam), [searchKeyword, sortParam, saleParam]);

  const handleCategoryClick = useCallback((value) => {
    setSelectedCategory(value);
    setSelectedPrice(null);
    setIsSidebarOpen(false);
  }, []);

  const handlePriceToggle = useCallback((index) => {
    setSelectedPrice((prev) => (prev === index ? null : index));
  }, []);

  const handleReset = useCallback(() => {
    setSelectedCategory("all");
    setSelectedPrice(null);
    setIsSidebarOpen(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const hasFilter = selectedCategory !== "all" || selectedPrice !== null;

  return (
    <div className="container products-page">
      <h1 className="products-page-title">{pageTitle}</h1>

      <div className="products-toolbar">
        <button className="filter-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
          <i className="fa-solid fa-sliders"></i>
          Bộ lọc {hasFilter && "(đang lọc)"}
        </button>
        {hasFilter && (
          <button className="filter-clear-btn" onClick={handleReset}>
            Xóa bộ lọc
          </button>
        )}
      </div>

      <div
        className={`filter-sidebar-overlay${isSidebarOpen ? " open" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className="catalog-container" style={{ padding: 0 }}>
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

        <div className="catalog-main">
          {loading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <div className="products-state">
              <i className="fa-solid fa-triangle-exclamation products-state-icon empty"></i>
              <p>{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="products-state">
              <i className="fa-solid fa-box-open products-state-icon empty"></i>
              <p>Không tìm thấy sản phẩm nào phù hợp.</p>
            </div>
          ) : (
            <>
              <VirtualizedProductGrid products={products} columns={3} />

              <div ref={lastProductRef} style={{ height: 1, width: "100%" }} />

              {loadingMore && (
                <div className="load-more-container">
                  <button className="load-more-btn glass" disabled>
                    <i className="fa-solid fa-circle-notch fa-spin"></i> ĐANG TẢI...
                  </button>
                </div>
              )}
            </>
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
