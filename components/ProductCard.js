export default function ProductCard({ product }) {
  return (
    <div className="product-card">
      {/* Product Card component content here */}
      <h3 className="product-name">{product?.name || 'Sản phẩm mới'}</h3>
    </div>
  );
}
