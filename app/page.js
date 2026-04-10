export default function Home() {
  const featuredProducts = [
    { id: 1, name: 'MacBook Pro 16" M3 Max', price: '89.990.000đ', icon: 'fa-apple' },
    { id: 2, name: 'iPhone 15 Pro Max 256GB', price: '29.500.000đ', icon: 'fa-mobile-screen-button' },
    { id: 3, name: 'Tai nghe Sony WH-1000XM5', price: '7.990.000đ', icon: 'fa-headphones' },
    { id: 4, name: 'Apple Watch Ultra 2', price: '21.000.000đ', icon: 'fa-clock' }
  ];

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1 className="hero-title">Khám Phá Kỷ Nguyên Công Nghệ Mới</h1>
          <p className="hero-subtitle">Nơi mang đến những thiết bị điện tử tối tân nhất. Trải nghiệm xu hướng công nghệ tương lai ngay trong lòng bàn tay bạn.</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '30px' }}>
            <button className="btn btn-primary">Mua Ngay <i className="fa-solid fa-arrow-right"></i></button>
            <button className="btn btn-outline">Tìm Hiểu Thêm</button>
          </div>
        </div>
      </section>

      <section className="container">
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Sản Phẩm <span style={{ color: 'var(--accent-color)' }}>Nổi Bật</span></h2>
        <div className="product-grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="product-card glass">
              <div className="product-icon">
                <i className={`fa-brands ${product.icon} ${!product.icon.includes('brands') ? 'fa-solid' : ''}`}></i>
              </div>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">{product.price}</p>
              <button className="btn btn-outline" style={{width: '100%'}}>
                <i className="fa-solid fa-cart-shopping"></i> Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="container" style={{ margin: '60px auto', padding: '40px', textAlign: 'center' }}>
        <div className="glass" style={{ padding: '50px 20px' }}>
          <h2>Tham gia thành viên TechStore</h2>
          <p style={{ color: 'var(--text-secondary)', margin: '15px 0 30px' }}>Nhận ưu đãi giảm ngay 10% cho đơn hàng đầu tiên của bạn.</p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' }}>
             <input 
                type="email" 
                placeholder="Email của bạn..." 
                style={{ flex: 1, padding: '12px 20px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white', outline: 'none' }}
             />
             <button className="btn btn-primary">Đăng Ký</button>
          </div>
        </div>
      </section>
    </>
  );
}
