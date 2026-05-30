"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

/**
 * ProductImageGallery
 *
 * Props:
 *   images      — string[]   list of image URLs (can be 1 or many)
 *   productName — string     used as alt text
 *
 * Features:
 *   - Main image + thumbnail strip
 *   - Keyboard navigation (← / →)
 *   - Touch/swipe support on mobile
 *   - Lightbox (click to expand to full-screen overlay)
 *   - Lazy-loading via Next.js <Image>
 */
export default function ProductImageGallery({ images = [], productName = "" }) {
  const [active, setActive]       = useState(0);
  const [lightbox, setLightbox]   = useState(false);
  const touchStartX               = useRef(null);

  const total = images.length;

  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft")  prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape")     setLightbox(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Touch swipe handlers
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (total === 0) {
    return (
      <div className="glass" style={{
        aspectRatio: "1/1", display: "flex", justifyContent: "center", alignItems: "center",
        fontSize: "8rem", color: "var(--accent-color)", borderRadius: "20px",
      }}>
        <i className="fa-solid fa-laptop-code"></i>
      </div>
    );
  }

  return (
    <>
      {/* ── Main image ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div
          className="glass"
          style={{
            position: "relative", aspectRatio: "1/1", borderRadius: "20px",
            overflow: "hidden", cursor: "zoom-in", userSelect: "none",
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => setLightbox(true)}
          aria-label={`Xem ảnh lớn: ${productName}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setLightbox(true)}
        >
          <Image
            src={images[active]}
            alt={`${productName} - ảnh ${active + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "contain", padding: "8px" }}
            priority={active === 0}
          />

          {/* Nav arrows — only show when there are multiple images */}
          {total > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Ảnh trước"
                style={arrowStyle("left")}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Ảnh tiếp theo"
                style={arrowStyle("right")}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>

              {/* Dot indicator */}
              <div style={{ position: "absolute", bottom: "12px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "6px" }}>
                {images.map((_, i) => (
                  <span key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: i === active ? "var(--brand-orange)" : "rgba(255,255,255,0.5)",
                    transition: "background 0.2s",
                    cursor: "pointer",
                  }}
                    onClick={(e) => { e.stopPropagation(); setActive(i); }}
                  />
                ))}
              </div>
            </>
          )}

          {/* Zoom icon hint */}
          <span style={{
            position: "absolute", top: "12px", right: "12px",
            background: "rgba(0,0,0,0.35)", color: "#fff",
            borderRadius: "8px", padding: "5px 8px", fontSize: "0.75rem",
            pointerEvents: "none",
          }}>
            <i className="fa-solid fa-magnifying-glass-plus"></i>
          </span>
        </div>

        {/* ── Thumbnail strip ── */}
        {total > 1 && (
          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Xem ảnh ${i + 1}`}
                style={{
                  flex: "0 0 72px", height: "72px", borderRadius: "10px",
                  overflow: "hidden", border: `2px solid ${i === active ? "var(--brand-orange)" : "var(--border-color)"}`,
                  cursor: "pointer", background: "var(--card-bg)",
                  transition: "border-color 0.2s", padding: 0, position: "relative",
                }}
              >
                <Image
                  src={src}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  sizes="72px"
                  style={{ objectFit: "contain", padding: "4px" }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Lightbox overlay ── */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Xem ảnh lớn"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={() => setLightbox(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Prevent click-through on the image itself */}
          <div
            style={{ position: "relative", width: "min(90vw, 720px)", height: "min(90vh, 720px)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[active]}
              alt={`${productName} - ảnh ${active + 1} (phóng to)`}
              fill
              sizes="90vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Close */}
          <button
            onClick={() => setLightbox(false)}
            aria-label="Đóng"
            style={{ position: "fixed", top: "20px", right: "24px", ...lightboxBtnStyle }}
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {total > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Ảnh trước" style={{ position: "fixed", left: "16px", ...lightboxBtnStyle }}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Ảnh tiếp theo" style={{ position: "fixed", right: "16px", ...lightboxBtnStyle }}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

function arrowStyle(side) {
  return {
    position: "absolute", top: "50%", [side]: "10px", transform: "translateY(-50%)",
    background: "rgba(0,0,0,0.45)", color: "#fff",
    border: "none", borderRadius: "50%", width: "36px", height: "36px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", zIndex: 2, fontSize: "0.9rem",
    transition: "background 0.2s",
  };
}

const lightboxBtnStyle = {
  background: "rgba(255,255,255,0.15)", color: "#fff",
  border: "none", borderRadius: "50%", width: "44px", height: "44px",
  display: "flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", fontSize: "1.1rem", top: "50%", transform: "translateY(-50%)",
};
