"use client";

import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { toast } from "react-hot-toast";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Vui lòng nhập địa chỉ giao hàng"),
  paymentMethod: z.enum(["cod", "banking"]),
});

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (status === "unauthenticated") {
      toast.error("Vui lòng đăng nhập trước khi thanh toán");
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: session?.user?.name || "",
      paymentMethod: "cod",
    }
  });

  if (!mounted || status === "loading") return null;
  if (!session) return null;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onSubmit = async (data) => {
    if (cart.length === 0) {
      toast.error("Giỏ hàng trống!");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/orders", {
        items: cart,
        shippingInfo: data,
        totalAmount: total,
      });
      toast.success("Đặt hàng thành công!");
      clearCart();
      router.push("/"); // Có thể tạo trang success riêng sau
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '40px' }}>Thanh Toán</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px' }}>
        
        {/* Checkout Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass" style={{ padding: '40px', borderRadius: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '30px' }}>Thông tin giao hàng</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Họ và tên</label>
              <input 
                {...register("fullName")}
                className="input-field" 
                placeholder="Nguyễn Văn A"
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
              />
              {errors.fullName && <p style={{ color: 'var(--pv-red)', fontSize: '0.8rem', marginTop: '5px' }}>{errors.fullName.message}</p>}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Số điện thoại</label>
              <input 
                {...register("phone")}
                className="input-field" 
                placeholder="09xxx"
                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white' }}
              />
              {errors.phone && <p style={{ color: 'var(--pv-red)', fontSize: '0.8rem', marginTop: '5px' }}>{errors.phone.message}</p>}
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Địa chỉ nhận hàng</label>
            <textarea 
              {...register("address")}
              rows="3"
              placeholder="Số nhà, tên đường, phường/xã..."
              style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'white', outline: 'none' }}
            ></textarea>
            {errors.address && <p style={{ color: 'var(--pv-red)', fontSize: '0.8rem', marginTop: '5px' }}>{errors.address.message}</p>}
          </div>

          <h2 style={{ fontSize: '1.5rem', margin: '40px 0 20px' }}>Phương thức thanh toán</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
             <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" value="cod" {...register("paymentMethod")} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Thanh toán khi nhận hàng (COD)</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Trả tiền mặt khi Shipper giao hàng</div>
                </div>
             </label>
             <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                <input type="radio" value="banking" {...register("paymentMethod")} />
                <div>
                  <div style={{ fontWeight: 'bold' }}>Chuyển khoản ngân hàng</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Xác nhận nhanh trong 5 phút</div>
                </div>
             </label>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '15px', marginTop: '40px', fontSize: '1.1rem' }}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Xác nhận Đặt hàng"}
          </button>
        </form>

        {/* Order Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass" style={{ padding: '30px', borderRadius: '20px' }}>
            <h3 style={{ marginBottom: '20px' }}>Tóm tắt đơn hàng</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{item.name} x {item.quantity}</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)}đ</span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
              <span>Thành tiền:</span>
              <span style={{ color: 'var(--accent-color)' }}>{new Intl.NumberFormat('vi-VN').format(total)}đ</span>
            </div>
          </div>
          
          <div style={{ padding: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
             <p><i className="fa-solid fa-lock" style={{ marginRight: '10px' }}></i> Thông tin của bạn được bảo mật tuyệt đối.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
