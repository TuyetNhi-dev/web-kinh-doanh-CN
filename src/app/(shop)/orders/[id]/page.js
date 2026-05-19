"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && id) {
      const fetchOrder = async () => {
        try {
          const res = await axios.get(`/api/orders/${id}`);
          setOrder(res.data);
        } catch (error) {
          console.error("Lỗi lấy thông tin đơn hàng:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, status, router]);

  if (loading || status === "loading") {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '70vh' }}>
        <p>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '70vh' }}>
        <h2>Không tìm thấy đơn hàng</h2>
        <button onClick={() => router.push("/orders")} className="btn btn-primary" style={{ marginTop: '20px' }}>
          Quay lại Lịch sử đơn hàng
        </button>
      </div>
    );
  }

  const statusMap = {
    pending: { label: "Chờ xử lý", color: "#f59e0b" },
    processing: { label: "Đang giao", color: "#3b82f6" },
    completed: { label: "Hoàn thành", color: "#22c55e" },
    cancelled: { label: "Đã hủy", color: "#ef4444" },
  };

  const st = statusMap[order.status] || statusMap.pending;

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--brand-orange)', marginBottom: '20px', fontWeight: 'bold' }}>
          <i className="fa-solid fa-arrow-left"></i> Quay lại lịch sử
        </Link>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Chi tiết đơn hàng #{order.id}</h1>

        <div className="glass" style={{ padding: '30px', borderRadius: '20px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Thông tin chung</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Ngày đặt:</span>
            <span>{new Date(order.created_at).toLocaleString('vi-VN')}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Phương thức thanh toán:</span>
            <span style={{ textTransform: 'uppercase' }}>{order.payment_method}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Trạng thái:</span>
            <span style={{ color: st.color, fontWeight: 'bold' }}>{st.label}</span>
          </div>
          
          <h3 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Thông tin giao hàng</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Người nhận:</span>
            <span style={{ fontWeight: 'bold' }}>{order.shipping_name || order.customer_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Số điện thoại:</span>
            <span>{order.shipping_phone}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Địa chỉ:</span>
            <span style={{ textAlign: 'right', maxWidth: '60%' }}>{order.shipping_address}</span>
          </div>

          <h3 style={{ marginTop: '20px', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>Sản phẩm</h3>
          {order.items && order.items.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={item.image_url || '/placeholder.jpg'} alt={item.name || 'Sản phẩm'} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{item.name || `Sản phẩm #${item.product_id}`}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Số lượng: {item.quantity}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Tổng tiền:</span>
            <span style={{ fontWeight: 'bold', color: 'var(--brand-orange)', fontSize: '1.5rem' }}>
              {new Intl.NumberFormat('vi-VN').format(order.total_amount)}đ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
