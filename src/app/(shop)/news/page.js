export default function NewsPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '60vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: 'var(--text-primary)' }}>Tin tức Công nghệ</h1>
      <div className="glass" style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <i className="fa-regular fa-newspaper" style={{ fontSize: '4rem', color: 'var(--brand-orange)', marginBottom: '20px' }}></i>
        <h2 style={{ color: 'var(--text-primary)' }}>Đang cập nhật...</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>
          Chuyên mục tin tức hiện đang trong quá trình xây dựng nội dung. Vui lòng theo dõi và quay lại sau nhé!
        </p>
      </div>
    </div>
  );
}
