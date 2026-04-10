export default function CartPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px' }}>Giỏ Hàng Của Bạn</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
        
        {/* Danh sách Sản Phẩm Trong Giỏ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Item 1 */}
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '20px', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', color: 'var(--accent-color)' }}>
              <i className="fa-brands fa-apple"></i>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>MacBook Pro 16" M3 Max</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Màu: Space Black</p>
            </div>
            <div style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>89.990.000đ</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '5px 15px', borderRadius: '8px' }}>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>-</button>
              <span>1</span>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fa-solid fa-trash"></i></button>
          </div>

          {/* Item 2 */}
          <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '20px', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', color: 'var(--accent-color)' }}>
              <i className="fa-solid fa-headphones"></i>
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>Tai nghe Sony WH-1000XM5</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Màu: Black</p>
            </div>
            <div style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>7.990.000đ</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.3)', padding: '5px 15px', borderRadius: '8px' }}>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>-</button>
              <span>1</span>
              <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>+</button>
            </div>
            <button style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '1.2rem' }}><i className="fa-solid fa-trash"></i></button>
          </div>

        </div>

        {/* Cột Tổng Tiền (Thanh Toán) */}
        <div className="glass" style={{ padding: '30px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '25px', fontSize: '1.5rem' }}>Tổng Tính</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-secondary)' }}>
            <span>Tạm tính:</span>
            <span>97.980.000đ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-secondary)' }}>
            <span>Giảm giá (Khuyến mãi):</span>
            <span style={{ color: 'var(--accent-hover)' }}>-0đ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', paddingBottom: '20px', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <span>Phí giao hàng:</span>
            <span>Miễn phí</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontSize: '1.3rem', fontWeight: 'bold' }}>
            <span>Tổng cộng:</span>
            <span style={{ color: 'var(--accent-color)' }}>97.980.000đ</span>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>Tiến Hành Thanh Toán</button>
        </div>

      </div>
    </div>
  );
}
