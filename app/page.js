export default function Home() {
  const pvMockProducts = [
    { 
      id: 1, 
      name: 'PC TechStore Pro Max (Intel Core i7-14700K / 32GB RAM / 1TB SSD / RTX 4070 Ti)', 
      oldPrice: '45.990.000', 
      price: '39.990.000', 
      discount: '-13%',
      brand: 'TechStore Build',
      specs: ['Core i7-14700K', '32GB DDR5', '1TB Gen4 SSD', 'RTX 4070 Ti 12GB'],
      saveAmt: '6.000.000',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 2, 
      name: 'Laptop Gaming ASUS ROG Strix G16 (i7-13650HX / 16GB / 512GB / RTX 4050)', 
      oldPrice: '32.990.000', 
      price: '28.490.000', 
      discount: '-14%',
      brand: 'ASUS',
      specs: ['16" 165Hz', 'Core i7-13650HX', '16GB RAM', 'RTX 4050 6GB'],
      saveAmt: '4.500.000',
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 3, 
      name: 'Màn hình LENOVO Legion R27q-30 (27" 2K IPS 165Hz 1ms)', 
      oldPrice: '7.490.000', 
      price: '5.990.000', 
      discount: '-20%',
      brand: 'LENOVO',
      specs: ['27" 2K Fast IPS', '165Hz (OC 180Hz)', '1ms GtG', '99% sRGB'],
      saveAmt: '1.500.000',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 4, 
      name: 'Bàn phím cơ không dây Logitech MX Mechanical Mini', 
      oldPrice: '3.590.000', 
      price: '2.990.000', 
      discount: '-16%',
      brand: 'LOGITECH',
      specs: ['Tactile Quiet', 'Smart Illumination', 'Bluetooth / Bolt', 'Type-C'],
      saveAmt: '600.000',
      image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 5, 
      name: 'VGA MSI GeForce RTX 4060 Ti Ventus 2X Black 8G OC', 
      oldPrice: '12.990.000', 
      price: '11.290.000', 
      discount: '-13%',
      brand: 'MSI',
      specs: ['RTX 4060 Ti', '8GB GDDR6', 'PCIe 4.0', 'DLSS 3'],
      saveAmt: '1.700.000',
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 6, 
      name: 'Chuột không dây Razer DeathAdder V3 Pro - Black', 
      oldPrice: '3.990.000', 
      price: '3.390.000', 
      discount: '-15%',
      brand: 'RAZER',
      specs: ['63g Ultra-lightweight', 'Focus Pro 30K Optical', 'HyperSpeed Wireless'],
      saveAmt: '600.000',
      image: 'https://images.unsplash.com/photo-1615663245857-ac1eeb5304ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    }
  ];

  return (
    <>
      {/* Hero Banner Section */}
      <section className="container" style={{ marginTop: '20px' }}>
        <div className="hero-banner" style={{ borderRadius: '16px', overflow: 'hidden', height: '450px' }}>
          <div className="hero-content">
            <h1 className="hero-title">Xây Dựng Cấu Hình Mơ Ước</h1>
            <p className="hero-subtitle">Bộ máy PC tự lắp ráp chỉ từ 10.990.000đ</p>
            <button className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.1rem', backgroundColor: '#0052cc', color: '#fff', fontWeight: 'bold', borderRadius: '8px' }}>
              Mua Sắm Ngay
            </button>
          </div>
        </div>
      </section>

      {/* Bento Promo Grid Section */}
      <section className="container promo-bento-grid">
        {/* Left Column - Large Item */}
        <a href="#" className="bento-item bento-item-large">
          <img src="https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Khuyến mãi Gaming" />
          <div className="bento-content">
            <h3>Khuyến mãi Gaming</h3>
            <p>Giảm đến 50%</p>
          </div>
        </a>

        {/* Right Column - 2x2 Grid */}
        <div className="promo-bento-right">
          <a href="#" className="bento-item bento-item-small">
            <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Ưu đãi sinh viên" />
            <div className="bento-content">
              <h3>Ưu đãi sinh viên</h3>
              <p>Giá đặc biệt</p>
            </div>
          </a>
          <a href="#" className="bento-item bento-item-small">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Hàng mới về" />
            <div className="bento-content">
              <h3>Hàng mới về</h3>
              <p>Công nghệ mới nhất</p>
            </div>
          </a>
          <a href="#" className="bento-item bento-item-small">
            <img src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Combo PC Lắp ráp" />
            <div className="bento-content">
              <h3>Combo PC Lắp ráp</h3>
              <p>Tiết kiệm khủng</p>
            </div>
          </a>
          <a href="#" className="bento-item bento-item-small">
            <img src="https://images.unsplash.com/photo-1615663245857-ac1eeb5304ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Lễ hội Phụ kiện" />
            <div className="bento-content">
              <h3>Lễ hội Phụ kiện</h3>
              <p>Gear Phải Có</p>
            </div>
          </a>
        </div>
      </section>

      {/* Main Catalog View (Phong Vu Style) */}
      <section className="container catalog-container">
        
        {/* Main Content */}
        <div className="catalog-main" style={{ width: '100%' }}>
          
          <div className="catalog-header">
            <h2 className="catalog-title">Sản Phẩm Công Nghệ - TechStore Đỉnh Cao</h2>
            
            {/* Sorting Tabs */}
            <div className="sort-tabs">
              <span className="sort-label">Sắp xếp theo:</span>
              <button className="sort-btn active">Khuyến mãi tốt nhất</button>
              <button className="sort-btn">Giá tăng dần</button>
              <button className="sort-btn">Giá giảm dần</button>
              <button className="sort-btn">Sản phẩm mới nhất</button>
              <button className="sort-btn">Bán chạy nhất</button>
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="promo-banner">
            <h3><i className="fa-solid fa-fire" style={{color: '#ff4e50'}}></i> Mua Ngay PC Lắp Ráp TechStore - Nhận Quà Đỉnh</h3>
            <button className="btn btn-outline" style={{backgroundColor: '#fff', border: 'none', color: '#111'}}>Xem Thể Lệ</button>
          </div>

          {/* Product Grid */}
          <div className="pv-product-grid">
            {pvMockProducts.map((product) => (
              <div key={product.id} className="pv-product-card">
                <div className="pv-badge">TIẾT KIỆM {product.saveAmt}đ</div>
                <img className="pv-product-img" src={product.image} alt={product.name} />
                
                <div className="pv-product-brand">{product.brand}</div>
                <h3 className="pv-product-name" title={product.name}>{product.name}</h3>
                
                <div className="pv-product-specs">
                  <ul>
                    {product.specs.map((spec, idx) => (
                      <li key={idx}>- {spec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="pv-price-cart-row">
                  <div className="pv-product-pricing">
                    <span className="pv-price">{product.price} ₫</span>
                    <div className="pv-old-price-container">
                      <span className="pv-old-price">{product.oldPrice} ₫</span>
                      <span className="pv-discount-rate">{product.discount}</span>
                    </div>
                  </div>
                  <button className="add-cart-btn" title="Thêm vào giỏ hàng">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


    </>
  );
}
