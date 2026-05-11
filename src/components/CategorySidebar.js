"use client";

import Link from "next/link";
import { useState } from "react";

const categories = [
  { 
    name: "Sản phẩm Apple", 
    icon: "fa-brands fa-apple",
    subMenu: [
      { title: "Mac", links: ["MacBook Neo", "Macbook Air", "MacBook Pro", "iMac", "Mac mini", "Mac Studio"] },
      { title: "iPhone", links: ["iPhone 17 series", "iPhone 16 series", "iPhone 15 series"] },
      { title: "iPad", links: ["iPad Pro", "iPad Air", "iPad Mini", "iPad Gen Series"] },
      { title: "Phụ kiện Apple", links: ["Apple Watch", "Củ sạc & Cáp sạc", "Tai nghe Apple", "Bàn phím, chuột & bút", "Apple TV", "Airtag"] },
    ]
  },
  { 
    name: "Laptop", 
    icon: "fa-solid fa-laptop",
    subMenu: [
      { title: "Thương hiệu", links: ["Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "LG", "Gigabyte"] },
      { title: "Nhu cầu", links: ["Laptop Gaming", "Sinh viên - Văn phòng", "Mỏng nhẹ", "Đồ họa - Kỹ thuật"] },
    ]
  },
  { 
    name: "Điện thoại, Tablet", 
    icon: "fa-solid fa-mobile-screen-button",
    subMenu: [
      { title: "Hãng điện thoại", links: ["iPhone", "Samsung", "Xiaomi", "OPPO", "vivo", "Realme", "Nokia"] },
      { title: "Điện thoại HOT", links: ["iPhone 17 Pro Max", "Galaxy S26 Ultra", "Xiaomi 17 Ultra", "OPPO Find X9"] },
      { title: "Hãng máy tính bảng", links: ["iPad", "Samsung", "Xiaomi", "Lenovo", "Huawei"] },
    ]
  },
  { name: "Phụ kiện", icon: "fa-solid fa-headphones" },
  { name: "Smartwatch", icon: "fa-solid fa-clock" },
  { name: "Thiết bị văn phòng", icon: "fa-solid fa-print" },
  { name: "Máy tính bàn", icon: "fa-solid fa-desktop" },
  { name: "Gaming Gear", icon: "fa-solid fa-gamepad" },
  { name: "Thiết bị âm thanh", icon: "fa-solid fa-music" },
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
            <Link href={`/products?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className={`category-item ${hoveredCategory?.name === cat.name ? 'active' : ''}`}>
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
        <div className="mega-menu-panel">
          <div className="mega-menu-content" style={{ gridTemplateColumns: `repeat(${Math.min(hoveredCategory.subMenu.length, 4)}, 1fr)` }}>
            {hoveredCategory.subMenu.map((col, idx) => (
              <div key={idx} className="mega-menu-column">
                <h4 style={{ color: 'var(--brand-orange)', textTransform: 'uppercase' }}>{col.title}</h4>
                <ul>
                  {col.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link href={`/products?search=${encodeURIComponent(link)}`}>{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
