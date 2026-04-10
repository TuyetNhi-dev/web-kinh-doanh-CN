export default function LoginPage() {
  return (
    <div className="container" style={{ padding: '80px 20px', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '40px', textAlign: 'center' }}>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Chào Mừng Trở Lại</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Đăng nhập để vào TechStore</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
            <input 
              type="email" 
              placeholder="Nhập email của bạn..." 
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }}
              required
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mật khẩu</label>
              <a href="#" style={{ fontSize: '0.85rem' }}>Quên mật khẩu?</a>
            </div>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}>Đăng Nhập</button>
        </form>

        <div style={{ margin: '30px 0', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--card-bg)', padding: '0 15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hoặc</span>
        </div>

        <button className="btn btn-outline" style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <i className="fa-brands fa-google"></i> Đăng nhập với Google
        </button>

        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Chưa có tài khoản? <a href="#" style={{ color: 'var(--accent-color)' }}>Đăng ký ngay</a>
        </p>

      </div>
    </div>
  );
}
