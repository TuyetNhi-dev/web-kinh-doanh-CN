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
          <h3 style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Thông tin đơn hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Mã đơn hàng:</span>
            <span style={{ fontWeight: 'bold' }}>#{orderId}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Ngày đặt:</span>
            <span>{order?.created_at ? new Date(order.created_at).toLocaleString('vi-VN') : ''}</span>
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
          
          <h3 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Thông tin giao hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Người nhận:</span>
            <span style={{ fontWeight: 'bold' }}>{order?.shipping_name || order?.customer_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Số điện thoại:</span>
            <span>{order?.shipping_phone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Địa chỉ:</span>
            <span style={{ textAlign: 'right', maxWidth: '60%' }}>{order?.shipping_address}</span>
          </div>

          {order?.items && order.items.length > 0 && (
            <>
              <h3 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Sản phẩm</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.image_url || '/placeholder.jpg'} alt={item.name || 'Sản phẩm'} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }} />
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{item.name || `Sản phẩm #${item.product_id}`}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>SL: {item.quantity}</span>
                      </div>
                    </div>
                    <span style={{ fontWeight: 'bold' }}>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '15px', marginTop: '10px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Tổng tiền:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1.4rem' }}>
              {new Intl.NumberFormat('vi-VN').format(order?.total_amount)}đ
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button onClick={() => router.push("/")} className="btn" style={{ flex: 1, padding: '15px', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)' }}>
            Về trang chủ
          </button>
          <button onClick={() => router.push("/orders")} className="btn btn-primary" style={{ flex: 1, padding: '15px' }}>
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
