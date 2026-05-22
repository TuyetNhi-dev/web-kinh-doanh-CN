import Link from "next/link";

const infoPages = {
  "huong-dan-mua-hang": {
    title: "Hướng dẫn mua hàng",
    description:
      "Tìm hiểu cách chọn sản phẩm, thêm vào giỏ hàng, thanh toán và theo dõi đơn hàng trên TechStore. Chúng tôi cam kết quy trình mua hàng nhanh chóng và an toàn.",
  },
  faq: {
    title: "Câu hỏi thường gặp (FAQ)",
    description:
      "Các câu hỏi thường gặp về sản phẩm, giao hàng, thanh toán và đổi trả được tổng hợp tại đây để bạn có thông tin nhanh nhất.",
  },
  "trung-tam-bao-hanh": {
    title: "Trung tâm bảo hành",
    description:
      "Thông tin về chế độ bảo hành, điều kiện bảo hành và các địa điểm bảo hành chính hãng cho sản phẩm của bạn.",
  },
  "tra-cuu-don-hang": {
    title: "Tra cứu đơn hàng",
    description:
      "Nhập mã đơn hàng hoặc thông tin liên hệ để kiểm tra trạng thái giao hàng và lịch trình đơn hàng một cách nhanh chóng.",
  },
  "bao-mat-thong-tin": {
    title: "Bảo mật thông tin",
    description:
      "Chúng tôi cam kết bảo vệ dữ liệu cá nhân của bạn. Thông tin cá nhân và giao dịch được lưu trữ an toàn theo chính sách bảo mật.",
  },
  "chinh-sach-doi-tra": {
    title: "Chính sách Đổi trả",
    description:
      "Xem điều kiện, thời hạn và cách thực hiện đổi trả sản phẩm nếu không hài lòng hoặc sản phẩm gặp vấn đề kỹ thuật.",
  },
  "chinh-sach-giao-hang": {
    title: "Chính sách Giao hàng",
    description:
      "Thông tin phí giao hàng, thời gian vận chuyển và các khu vực hỗ trợ giao hàng tận nơi của TechStore.",
  },
  "chinh-sach-bao-hanh": {
    title: "Chính sách Bảo hành",
    description:
      "Chi tiết về điều kiện bảo hành, bảo hành chính hãng và các dịch vụ bảo hành sau mua hàng.",
  },
};

export default function InfoPage({ params }) {
  const page = infoPages[params.slug] || {
    title: "Thông tin",
    description: "Nội dung đang được cập nhật. Vui lòng quay lại sau hoặc liên hệ hỗ trợ khách hàng.",
  };

  return (
    <main className="info-page">
      <section className="info-card">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        <Link href="/">
          <button type="button" className="info-back-button">
            Quay về trang chủ
          </button>
        </Link>
      </section>
    </main>
  );
}
