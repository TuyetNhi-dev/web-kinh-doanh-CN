"use client";

import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '100px 20px', textAlign: 'center', minHeight: '70vh' }}>
        <i className="fa-solid fa-cart-shopping" style={{ fontSize: '5rem', color: 'rgba(255,255,255,0.1)', marginBottom: '30px' }}></i>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '20px 0 40px' }}>Hãy thêm các sản phẩm công nghệ tuyệt vời vào giỏ nhé!</p>
        <Link href="/products" className="btn btn-primary" style={{ padding: '12px 30px' }}>Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <h1 style={{ marginBottom: '40px' }}>Giỏ Hàng Của Bạn</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'start' }}>
        
        {/* List of Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.map((item) => (
            <div key={item.id} className="glass" style={{ display: 'flex', gap: '20px', padding: '20px', borderRadius: '15px', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <i className="fa-solid fa-laptop" style={{ fontSize: '2rem', color: 'var(--accent-color)' }}></i>
                )}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{item.name}</h3>
                <p style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button 
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ width: '30px', height: '30px', borderRadius: '50%', border: '1px solid var(--border-color)', background: 'transparent', color: 'white', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ background: 'transparent', border: 'none', color: 'var(--pv-red, #ff4d4d)', cursor: 'pointer', fontSize: '1.2rem', padding: '10px' }}
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
          ))}

          <button 
            onClick={clearCart}
            style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem', marginTop: '10px' }}
          >
            Xóa toàn bộ giỏ hàng
          </button>
        </div>

        {/* Order Summary */}
        <div className="glass" style={{ padding: '30px', borderRadius: '20px', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '25px' }}>Tổng đơn hàng</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-secondary)' }}>
            <span>Tạm tính</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', color: 'var(--text-secondary)' }}>
            <span>Giao hàng</span>
            <span style={{ color: 'var(--accent-color)' }}>Miễn phí</span>
          </div>
          
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '20px 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Tổng cộng</span>
            <span style={{ color: 'var(--accent-color)' }}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
          </div>

          <Link href="/checkout" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', padding: '15px' }}>
            Tiến hành thanh toán
          </Link>
          
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link href="/products" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tiếp tục mua sắm</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
