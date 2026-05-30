"use client";

import { useCartStore } from "@/store/useCartStore";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import ProductReviews from "@/components/ProductReviews";
import ProductImageGallery from "@/components/ProductImageGallery";

export default function ProductClient({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const router = useRouter();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} đã được thêm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push("/cart");
  };

  // Build images array from the product. When the DB gains multi-image
  // support (e.g. a product_images JSON column), replace this line.
  const images = product.image_url ? [product.image_url] : [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '50px', alignItems: 'start' }}>

      {/* Product Gallery */}
      <ProductImageGallery images={images} productName={product.name} />

      {/* Product Info */}
      <div>
        <span style={{ backgroundColor: 'rgba(102, 252, 241, 0.1)', color: 'var(--accent-color)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
          {product.category || "Công Nghệ"}
        </span>
        <h1 style={{ fontSize: '2.5rem', margin: '20px 0', lineHeight: 1.2 }}>{product.name}</h1>
        <p style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '20px' }}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
        </p>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '30px' }}>
          {product.description || "Mô tả sản phẩm đang được cập nhật..."}
        </p>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '15px 40px', fontSize: '1.2rem', flex: 2 }}
            onClick={handleBuyNow}
          >
            Mua Ngay
          </button>
          <button
            className="btn btn-primary"
            style={{
              padding: '15px 30px', fontSize: '1.2rem', flex: 1
            }}
            onClick={handleAddToCart}
          >
            <i className="fa-solid fa-cart-plus"></i> Thêm Giỏ
          </button>
        </div>

        <div style={{ marginTop: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '30px' }}>
           <p><i className="fa-solid fa-truck-fast" style={{color: 'var(--accent-color)', marginRight: '10px'}}></i> Giao hàng siêu tốc nội thành 2h</p>
           <p><i className="fa-solid fa-shield-halved" style={{color: 'var(--accent-color)', marginRight: '10px'}}></i> Bảo hành chính hãng 12 tháng</p>
           <p><i className="fa-solid fa-rotate" style={{color: 'var(--accent-color)', marginRight: '10px'}}></i> Đổi trả trong 7 ngày nếu có lỗi NSX</p>
        </div>
      </div>

      {/* Product Reviews */}
      <div style={{ gridColumn: "1 / -1" }}>
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
