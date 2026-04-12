"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Define Validation Schema with Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email hoặc mật khẩu không chính xác!");
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="container" style={{ padding: '80px 20px', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '40px', textAlign: 'center' }}>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Chào Mừng Trở Lại</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Đăng nhập để vào TechStore</p>

        {error && <p style={{ color: 'var(--pv-red, #ff4d4d)', marginBottom: '15px' }}>{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
            <input 
              {...register("email")}
              type="email" 
              placeholder="Nhập email của bạn..." 
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '8px', 
                border: `1px solid ${errors.email ? 'var(--pv-red, #ff4d4d)' : 'var(--border-color)'}`, 
                background: 'rgba(0,0,0,0.3)', 
                color: 'white', 
                outline: 'none' 
              }}
            />
            {errors.email && <span style={{ fontSize: '0.8rem', color: 'var(--pv-red, #ff4d4d)', marginTop: '5px' }}>{errors.email.message}</span>}
          </div>

          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mật khẩu</label>
              <a href="#" style={{ fontSize: '0.85rem' }}>Quên mật khẩu?</a>
            </div>
            <input 
              {...register("password")}
              type="password" 
              placeholder="••••••••" 
              style={{ 
                width: '100%', 
                padding: '15px', 
                borderRadius: '8px', 
                border: `1px solid ${errors.password ? 'var(--pv-red, #ff4d4d)' : 'var(--border-color)'}`, 
                background: 'rgba(0,0,0,0.3)', 
                color: 'white', 
                outline: 'none' 
              }}
            />
            {errors.password && <span style={{ fontSize: '0.8rem', color: 'var(--pv-red, #ff4d4d)', marginTop: '5px' }}>{errors.password.message}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <div style={{ margin: '30px 0', borderTop: '1px solid var(--border-color)', position: 'relative' }}>
          <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--card-bg)', padding: '0 15px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hoặc</span>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="btn btn-outline" 
          style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
          <i className="fa-brands fa-google"></i> Đăng nhập với Google
        </button>

        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Chưa có tài khoản? <a href="#" style={{ color: 'var(--accent-color)' }}>Đăng ký ngay</a>
        </p>

      </div>
    </div>
  );
}
