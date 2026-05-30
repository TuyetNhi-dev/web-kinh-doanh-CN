"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { List } from "react-window";
import ProductCard from "./ProductCard";

export default function VirtualizedProductGrid({ products, columns = 2, rowHeight = 420, overscan = 2 }) {
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(820);

  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.clientWidth);
      setContainerHeight(Math.max(560, window.innerHeight - 240));
    };

    updateSize();
    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.resetAfterIndex(0, true);
    }
  }, [containerWidth, columns]);

  const rowCount = useMemo(() => Math.ceil(products.length / columns), [products.length, columns]);

  const Row = useCallback(
    ({ index, style }) => {
      const start = index * columns;
      const items = products.slice(start, start + columns);

      return (
        <div style={{ ...style, display: "flex", gap: "16px", padding: "8px 0", boxSizing: "border-box" }}>
          {items.map((product) => (
            <div key={product.id} style={{ flex: 1, minWidth: 0 }}>
              <ProductCard product={product} />
            </div>
          ))}
          {Array.from({ length: columns - items.length }, (_, idx) => (
            <div key={`empty-${idx}`} style={{ flex: 1, minWidth: 0 }} />
          ))}
        </div>
      );
    },
    [products, columns]
  );

  if (!containerWidth) {
    return <div ref={containerRef} className="virtualized-grid-wrapper" style={{ width: "100%" }} />;
  }

  // react-window v2 `List` expects `rowCount` and `rowHeight` props.
  // Also guard against empty product arrays to avoid invalid index errors.
  if (rowCount === 0) {
    return (
      <div ref={containerRef} className="virtualized-grid-wrapper" style={{ width: "100%" }}>
        {/* empty placeholder when no products */}
        <div className="product-grid" style={{ padding: 0 }}>
          <div className="products-state">
            <i className="fa-solid fa-box-open products-state-icon empty"></i>
            <p>Không có sản phẩm để hiển thị.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="virtualized-grid-wrapper" style={{ width: "100%" }}>
      <List
        ref={listRef}
        height={containerHeight}
        rowCount={rowCount}
        rowHeight={rowHeight}
        width={containerWidth}
        overscanCount={overscan}
        rowComponent={Row}
        rowProps={{}}
      />
    </div>
  );
}
