export default function ShowroomsPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Hệ thống Showroom</h1>
      <div className="glass" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <i className="fa-solid fa-store" style={{ fontSize: '4rem', color: 'var(--brand-orange)', marginBottom: '20px' }}></i>
        <h2 style={{ color: 'var(--text-primary)' }}>HBN TechStore Toàn Quốc</h2>
        
        <div style={{ textAlign: 'left', marginTop: '30px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <i className="fa-solid fa-location-dot" style={{ color: 'var(--brand-orange)', marginTop: '5px' }}></i>
            <p><strong>Trụ sở chính:</strong> 123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <i className="fa-solid fa-clock" style={{ color: 'var(--brand-orange)', marginTop: '5px' }}></i>
            <p><strong>Giờ mở cửa:</strong> 8:00 - 22:00 (Tất cả các ngày trong tuần)</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <i className="fa-solid fa-phone" style={{ color: 'var(--brand-orange)', marginTop: '5px' }}></i>
            <p><strong>Hotline tư vấn:</strong> 1800-TECH (Miễn phí cước gọi)</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <i className="fa-solid fa-envelope" style={{ color: 'var(--brand-orange)', marginTop: '5px' }}></i>
            <p><strong>Email hỗ trợ:</strong> cskh@techstore.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
