"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ICON_BY_CATEGORY = {
  Smartphone: "fa-solid fa-mobile-screen",
};
const DEFAULT_ICON = "fa-solid fa-laptop";

function CountdownBox({ value }) {
  return (
    <span className="countdown-box">{String(value).padStart(2, "0")}</span>
  );
}

export default function FlashSale({ products }) {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(({ h, m, s }) => {
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 0, m: 0, s: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const saleProducts = products.filter((p) => p.is_flash_sale);
  if (saleProducts.length === 0) return null;

  return (
    <div className="flash-sale-container">
      <div className="flash-sale-header">
        <div className="flash-sale-title">
          <img
            src="https://logodix.com/logo/2015093.png"
            alt="Flash Sale"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <h2 style={{ fontSize: "1.5rem", fontWeight: "800" }}>KẾT THÚC TRONG</h2>
          <div className="countdown">
            <CountdownBox value={timeLeft.h} />
            <span style={{ fontWeight: "bold" }}>:</span>
            <CountdownBox value={timeLeft.m} />
            <span style={{ fontWeight: "bold" }}>:</span>
            <CountdownBox value={timeLeft.s} />
          </div>
        </div>
        <Link href="/products" className="flash-sale-view-all">
          XEM TẤT CẢ <i className="fa-solid fa-chevron-right"></i>
        </Link>
      </div>

      <div className="flash-sale-grid">
        {saleProducts.map((product, index) => {
          const discount  = product.discount_percent > 0 ? product.discount_percent : 0;
          const salePrice = discount > 0 ? product.price * (1 - discount / 100) : product.price;
          const icon      = ICON_BY_CATEGORY[product.category] ?? DEFAULT_ICON;

          return (
            <div key={product.id}>
              <Link href={`/products/${product.id}`} className="product-card glass flash-sale-card">
                {discount > 0 && <div className="sale-badge">-{discount}%</div>}

                <div className="flash-sale-product-img">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} />
                  ) : (
                    <i className={`${icon} flash-sale-product-icon`} />
                  )}
                </div>

                <h3 className="flash-sale-product-name">{product.name}</h3>

                <div className="flash-sale-prices">
                  <span className="flash-sale-product-price">
                    {parseFloat(salePrice).toLocaleString("vi-VN")} đ
                  </span>
                  {discount > 0 && (
                    <span className="flash-sale-product-original">
                      {parseFloat(product.price).toLocaleString("vi-VN")} đ
                    </span>
                  )}
                </div>

                <div className="progress-bar-container">
                  <div className="progress-bar-fill" style={{ width: `${Math.max(80 - index * 15, 10)}%` }} />
                </div>
                <p className="sold-text">ĐÃ BÁN {20 + index * 12}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
