export default function ProductsPage() {
  const products = [
    { id: 1, name: 'MacBook Pro 16" M3 Max', price: '89.990.000đ', category: 'Laptop', icon: 'fa-apple' },
    { id: 2, name: 'iPhone 15 Pro Max 256GB', price: '29.500.000đ', category: 'Smartphone', icon: 'fa-mobile-screen-button' },
    { id: 3, name: 'Tai nghe Sony WH-1000XM5', price: '7.990.000đ', category: 'Phụ Kiện', icon: 'fa-headphones' },
    { id: 4, name: 'Apple Watch Ultra 2', price: '21.000.000đ', category: 'Smartwatch', icon: 'fa-clock' },
    { id: 5, name: 'Asus ROG Strix G16', price: '38.490.000đ', category: 'Laptop', icon: 'fa-laptop' },
    { id: 6, name: 'Samsung Galaxy S24 Ultra', price: '31.990.000đ', category: 'Smartphone', icon: 'fa-mobile' }
  ];

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Tất Cả Sản Phẩm</h1>
      
      <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
        {/* Bộ Lọc (Sidebar) */}
        <aside className="glass" style={{ minWidth: '250px', padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Danh Mục</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><a href="#" style={{ color: 'var(--accent-color)' }}>Tất Cả</a></li>
            <li><a href="#">Laptop & MacBook</a></li>
            <li><a href="#">Smartphone</a></li>
            <li><a href="#">Phụ Kiện Chính Hãng</a></li>
            <li><a href="#">Smartwatch</a></li>
          </ul>

          <h3 style={{ margin: '30px 0 15px' }}>Mức Giá</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><label><input type="checkbox"/> Dưới 10 triệu</label></li>
            <li><label><input type="checkbox"/> 10 - 20 triệu</label></li>
            <li><label><input type="checkbox"/> 20 - 40 triệu</label></li>
            <li><label><input type="checkbox"/> Trên 40 triệu</label></li>
          </ul>
        </aside>

        {/* Lưới Sản Phẩm */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
          {products.map(product => (
            <div key={product.id} className="product-card glass">
              <a href={`/products/${product.id}`}>
                <div className="product-icon">
                  <i className={`fa-brands ${product.icon} ${!product.icon.includes('brands') ? 'fa-solid' : ''}`}></i>
                </div>
                <h3 className="product-name" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                <p className="product-price">{product.price}</p>
              </a>
              <button className="btn btn-outline" style={{width: '100%', marginTop: '15px'}}>
                <i className="fa-solid fa-cart-shopping"></i> Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
