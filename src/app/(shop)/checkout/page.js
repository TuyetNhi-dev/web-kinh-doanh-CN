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

function ImageWithFallback({ src, alt, width = 40, height = 40, fallbackText = "" }) {
  const [failed, setFailed] = useState(false);
  const w = typeof width === "number" ? `${width}px` : width;
  const h = typeof height === "number" ? `${height}px` : height;
  if (!src || failed) {
    return (
      <div style={{ width: w, height: h, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f3f3", color: "#333", borderRadius: 6, fontWeight: 700 }}>
        {fallbackText}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      style={{ width: w, height: h, objectFit: "contain", borderRadius: 6 }}
    />
  );
}

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Vui lòng nhập địa chỉ giao hàng"),
  paymentMethod: z.enum(["momo", "vnpay"]),
});

// ── Payment redirect overlay ──────────────────────────────────────────────────
function PaymentRedirectOverlay({ method }) {
  const labels = {
    vnpay: { name: "VNPay", color: "#005baa", logo: "/images/vnpay.png" },
    momo:  { name: "MoMo",  color: "#a50064", logo: "/images/momo.png"  },
  };
  const info = labels[method] || { name: method, color: "#333" };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.75)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 24, padding: "48px 56px",
        textAlign: "center", maxWidth: 380,
      }}>
        {/* Spinner */}
        <div style={{
          width: 64, height: 64, margin: "0 auto 24px",
          border: `4px solid rgba(255,255,255,0.15)`,
          borderTopColor: info.color,
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

        <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 8, color: "#fff" }}>
          Đang chuyển đến {info.name}
        </h3>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem" }}>
          Vui lòng không đóng trình duyệt...
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, clearCart } = useCartStore();
  const router = useRouter();
  const [loading, setLoading]         = useState(false);
  const [mounted, setMounted]         = useState(false);
  const [redirecting, setRedirecting] = useState(null); // null | "vnpay" | "momo"

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
      paymentMethod: "momo",
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
      // ── Step 1: Create order ─────────────────────────────────────────────
      const response = await axios.post("/api/orders", {
        items: cart,
        shippingInfo: data,
        totalAmount: total,
      });
      
      const orderId = response.data.orderId;

      // ── Step 2: Route by payment method ──────────────────────────────────

      if (data.paymentMethod === "momo") {
        setRedirecting("momo");
        const momoRes = await axios.post("/api/payments/momo", {
          orderId,
          amount: total,
          orderInfo: `Thanh toan don hang #${orderId} tai HBN TechStore`,
        });
        if (momoRes.data.payUrl) {
          clearCart();
          window.location.href = momoRes.data.payUrl;
          return;
        }
        throw new Error("Không nhận được link MoMo");
      }

      if (data.paymentMethod === "vnpay") {
        setRedirecting("vnpay");
        toast.loading("Đang tạo link thanh toán VNPay...", { id: "vnpay-toast" });

        const vnpayRes = await axios.post("/api/payments/vnpay", {
          orderId,
          amount: total,
          orderInfo: `Thanh toan don hang #${orderId} tai HBN TechStore`,
        });

        if (vnpayRes.data.paymentUrl) {
          toast.dismiss("vnpay-toast");
          clearCart();
          window.location.href = vnpayRes.data.paymentUrl;
          return;
        }
        throw new Error("Không nhận được link VNPay");
      }

      // COD / Banking
      toast.success("Đặt hàng thành công!");
      clearCart();
      router.push(`/order-success?orderId=${orderId}`);
    } catch (error) {
      setRedirecting(null);
      toast.dismiss("vnpay-toast");
      toast.error(error.response?.data?.message || error.message || "Lỗi khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading overlay for payment redirects */}
      {redirecting && <PaymentRedirectOverlay method={redirecting} />}

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
                  <input type="radio" value="momo" {...register("paymentMethod")} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <ImageWithFallback src="/images/momo.png" alt="MoMo" width={48} height={48} fallbackText="MoMo" />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>Ví MoMo</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Thanh toán qua ứng dụng MoMo</div>
                    </div>
                  </div>
               </label>

               <label style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="vnpay" {...register("paymentMethod")} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <ImageWithFallback src="/images/vnpay.png" alt="VNPay" width={80} height={40} fallbackText="VN" />
                    <div>
                      <div style={{ fontWeight: 'bold' }}>VNPay</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Thanh toán qua cổng VNPay an toàn</div>
                    </div>
                  </div>
               </label>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '15px', marginTop: '40px', fontSize: '1.1rem' }}
              disabled={loading || !!redirecting}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{
                    width: 18, height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Đang xử lý...
                </span>
              ) : "Xác nhận Đặt hàng"}
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
               <p style={{ marginTop: '8px' }}><i className="fa-solid fa-shield-halved" style={{ marginRight: '10px', color: '#005baa' }}></i> Thanh toán VNPay được mã hóa HMAC-SHA512.</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
