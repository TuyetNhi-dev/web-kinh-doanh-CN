"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const resultCode = searchParams.get("resultCode"); // MoMo
  const vnpayStatus = searchParams.get("vnpay"); // Mock VNPay
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Lỗi lấy thông tin đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  if (loading) return (
    <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
      <div className="loader"></div>
      <p>Đang tải thông tin đơn hàng...</p>
    </div>
  );

  const isSuccess = resultCode === "0" || vnpayStatus === "success" || (order && order.status === "paid") || (order && order.payment_method === "cod");

  return (
    <div className="container" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '70vh' }}>
      <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '50px', borderRadius: '30px' }}>
        
        {isSuccess ? (
          <>
            <div style={{ fontSize: '5rem', color: '#4BB543', marginBottom: '20px' }}>
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h1 style={{ marginBottom: '10px' }}>Đặt hàng thành công!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
              Cảm ơn bạn đã tin tưởng HBN TechStore. Đơn hàng của bạn đang được xử lý.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '5rem', color: 'var(--pv-red)', marginBottom: '20px' }}>
              <i className="fa-solid fa-circle-xmark"></i>
            </div>
            <h1 style={{ marginBottom: '10px' }}>Thanh toán thất bại</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
              Có lỗi xảy ra trong quá trình thanh toán đơn hàng #{orderId}. Vui lòng thử lại hoặc chọn phương thức khác.
            </p>
          </>
        )}

        <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.05)', padding: '20px', borderRadius: '15px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Mã đơn hàng:</span>
            <span style={{ fontWeight: 'bold' }}>#{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Phương thức thanh toán:</span>
            <span style={{ textTransform: 'uppercase' }}>{order?.payment_method}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Trạng thái:</span>
            <span style={{ color: isSuccess ? '#4BB543' : 'var(--pv-red)', fontWeight: 'bold' }}>
              {order?.status === 'paid' ? 'Đã thanh toán' : order?.status === 'pending' ? 'Chờ xử lý' : 'Thanh toán thất bại'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
            <span>Tổng tiền:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1.2rem' }}>
              {new Intl.NumberFormat('vi-VN').format(order?.total_amount)}đ
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => router.push("/")} className="btn" style={{ flex: 1, padding: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)' }}>
            Về trang chủ
          </button>
          <button onClick={() => router.push("/profile?tab=orders")} className="btn btn-primary" style={{ flex: 1, padding: '15px' }}>
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
