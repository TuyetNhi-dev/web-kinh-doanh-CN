// Lưu ý: Đây là server component, ID được lấy từ params
export default function ProductDetail({ params }) {
  // Thay url này bằng API Database của bạn sau, mock data hiển thị:
  const productId = params.id;
  
  return (
    <div className="container" style={{ padding: '80px 20px', minHeight: '80vh' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center' }}>
        
        {/* Hộp Ảnh Sản Phẩm */}
        <div className="glass" style={{ aspectRatio: '1/1', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10rem', color: 'var(--accent-color)', borderRadius: '20px' }}>
          <i className="fa-brands fa-apple"></i>
        </div>

        {/* Thông tin Chi Tiết */}
        <div>
          <span style={{ backgroundColor: 'rgba(102, 252, 241, 0.1)', color: 'var(--accent-color)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>Sản Phẩm Cao Cấp {productId}</span>
          <h1 style={{ fontSize: '3rem', margin: '20px 0', lineHeight: 1.2 }}>MacBook Pro 16" M3 Max</h1>
          <p style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '20px' }}>89.990.000đ</p>
          
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '30px' }}>
            Chiếc MacBook Pro mạnh mẽ nhất từng được tạo ra. Chip M3 Max mang lại hiệu năng phi thường để xử lý những luồng công việc phức tạp nhất, thời lượng pin lên đến 22 giờ, cùng màn hình Liquid Retina XDR sống động.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px' }}>
              <i className="fa-solid fa-microchip" style={{color: 'var(--accent-color)'}}></i> M3 Max 14-core
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px' }}>
              <i className="fa-solid fa-memory" style={{color: 'var(--accent-color)'}}></i> 36GB RAM
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '10px' }}>
              <i className="fa-solid fa-hard-drive" style={{color: 'var(--accent-color)'}}></i> 1TB SSD
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem', flex: 2 }}>Mua Ngay</button>
            <button className="btn class" style={{ padding: '15px 30px', fontSize: '1.2rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', flex: 1 }}>
              <i className="fa-solid fa-cart-plus"></i> Thêm Giỏ Hàng
            </button>
          </div>
          
          <div style={{ marginTop: '30px', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
             <p><i className="fa-solid fa-check" style={{color: 'var(--accent-color)', marginRight: '10px'}}></i> Giao hàng siêu tốc nội thành 2h</p>
             <p><i className="fa-solid fa-check" style={{color: 'var(--accent-color)', marginRight: '10px'}}></i> Bảo hành chính hãng 12 tháng Apple Việt Nam</p>
          </div>
        </div>
      </div>
    </div>
  );
}
