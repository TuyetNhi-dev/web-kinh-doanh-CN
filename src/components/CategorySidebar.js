"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  {
    name: "Laptop",
    icon: "fa-solid fa-laptop",
    subMenu: [
      "MacBook Air",
      "MacBook Pro",
      "Dell XPS",
      "Asus ROG",
      "MSI Stealth",
    ],
  },
  {
    name: "Điện thoại",
    icon: "fa-solid fa-mobile-screen-button",
    subMenu: [
      "iPhone 17",
      "Galaxy S26",
      "Xiaomi 14",
      "OPPO Find X",
    ],
  },
  {
    name: "Phụ kiện",
    icon: "fa-solid fa-headphones",
    subMenu: [
      "Tai nghe Bluetooth",
      "Sạc nhanh",
      "Chuột không dây",
      "Bàn phím cơ",
    ],
  },
  {
    name: "Smartwatch",
    icon: "fa-solid fa-clock",
    subMenu: [
      "Apple Watch",
      "Galaxy Watch",
      "Fitbit",
      "Garmin",
    ],
  },
];

export default function CategorySidebar() {
  const [hoveredCategory, setHoveredCategory] = useState(null);

  return (
    <div className="category-sidebar-wrapper" onMouseLeave={() => setHoveredCategory(null)}>
      <div className="category-sidebar">
        {categories.map((cat, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredCategory(cat)}
          >
            <Link
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="category-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <i className={cat.icon}></i>
                  <span>{cat.name}</span>
                </div>
                <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', color: '#ccc' }}></i>
              </div>
            </Link>
          </div>
        ))}
        <Link href="/products" style={{ textDecoration: 'none' }}>
          <div className="category-item" style={{ borderBottom: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--brand-orange)' }}>
              <i className="fa-solid fa-plus-circle"></i>
              <span>Xem tất cả danh mục</span>
            </div>
          </div>
        </Link>
      </div>

      {hoveredCategory && hoveredCategory.subMenu && (
        <div className="category-details-panel">
          <div className="category-details-header">{hoveredCategory.name} nổi bật</div>
          <ul>
            {hoveredCategory.subMenu.map((item, idx) => (
              <li key={idx}>
                <Link href={`/products?search=${encodeURIComponent(item)}`}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
