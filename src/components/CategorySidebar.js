"use client";

import Link from "next/link";

const categories = [
  { name: "MacBook", icon: "fa-solid fa-laptop-code" },
  { name: "Laptop", icon: "fa-solid fa-laptop" },
  { name: "Tablet", icon: "fa-solid fa-tablet-screen-button" },
  { name: "iPhone", icon: "fa-solid fa-mobile-screen-button" },
  { name: "Smartwatch", icon: "fa-solid fa-clock" },
  { name: "Apple Watch", icon: "fa-solid fa-clock-rotate-left" },
  { name: "Thiết bị văn phòng", icon: "fa-solid fa-print" },
  { name: "Máy tính bàn", icon: "fa-solid fa-desktop" },
  { name: "Tai nghe", icon: "fa-solid fa-headphones" },
];

export default function CategorySidebar() {
  return (
    <div className="category-sidebar">
      {categories.map((cat, index) => (
        <div key={index} className="category-item">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className={cat.icon}></i>
            <span>{cat.name}</span>
          </div>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', color: '#ccc' }}></i>
        </div>
      ))}
      <div className="category-item" style={{ borderBottom: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--brand-orange)' }}>
          <i className="fa-solid fa-plus-circle"></i>
          <span>Xem tất cả danh mục</span>
        </div>
      </div>
    </div>
  );
}
