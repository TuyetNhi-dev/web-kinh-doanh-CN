"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/wishlist");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/wishlist")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setProducts(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="container" style={{ padding: "80px 20px", minHeight: "70vh", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Đang tải danh sách yêu thích...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "60px 20px", minHeight: "80vh" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px" }}>
        <i className="fa-solid fa-heart" style={{ color: "#ef4444" }}></i>
        Danh sách yêu thích
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "40px" }}>
        {products.length > 0
          ? `${products.length} sản phẩm đã lưu`
          : "Chưa có sản phẩm nào trong danh sách yêu thích"}
      </p>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-secondary)" }}>
          <i className="fa-regular fa-heart" style={{ fontSize: "4rem", opacity: 0.25, display: "block", marginBottom: "20px" }}></i>
          <p style={{ fontSize: "1.1rem", marginBottom: "24px" }}>Bạn chưa thêm sản phẩm nào vào yêu thích.</p>
          <Link href="/products" className="btn btn-primary" style={{ padding: "12px 35px" }}>
            Khám phá sản phẩm
          </Link>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "24px",
        }}>
          {products.map((product) => (
            <ProductCard key={product.product_id} product={{ ...product, id: product.product_id }} />
          ))}
        </div>
      )}
    </div>
  );
}
