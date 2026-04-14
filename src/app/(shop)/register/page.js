"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

const registerSchema = z.object({
  full_name: z.string().min(2, { message: "Họ tên phải có ít nhất 2 ký tự" }),
  email: z.string().email({ message: "Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post("/api/auth/register", {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
      });
      toast.success("Đăng ký thành công! Hãy đăng nhập nhé.");
      router.push("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi đăng ký");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '80px 20px', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center' }}>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Tạo Tài Khoản</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Gia nhập cộng đồng TechStore ngay</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Họ và Tên</label>
            <input 
              {...register("full_name")}
              type="text" 
              placeholder="Nhập họ tên của bạn..." 
              style={{ 
                width: '100%', padding: '15px', borderRadius: '8px', 
                border: `1px solid ${errors.full_name ? 'var(--pv-red, #ff4d4d)' : 'var(--border-color)'}`, 
                background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' 
              }}
            />
            {errors.full_name && <span style={{ fontSize: '0.8rem', color: 'var(--pv-red, #ff4d4d)', marginTop: '5px' }}>{errors.full_name.message}</span>}
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
            <input 
              {...register("email")}
              type="email" 
              placeholder="Nhập email của bạn..." 
              style={{ 
                width: '100%', padding: '15px', borderRadius: '8px', 
                border: `1px solid ${errors.email ? 'var(--pv-red, #ff4d4d)' : 'var(--border-color)'}`, 
                background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' 
              }}
            />
            {errors.email && <span style={{ fontSize: '0.8rem', color: 'var(--pv-red, #ff4d4d)', marginTop: '5px' }}>{errors.email.message}</span>}
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mật khẩu</label>
            <input 
              {...register("password")}
              type="password" 
              placeholder="••••••••" 
              style={{ 
                width: '100%', padding: '15px', borderRadius: '8px', 
                border: `1px solid ${errors.password ? 'var(--pv-red, #ff4d4d)' : 'var(--border-color)'}`, 
                background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' 
              }}
            />
            {errors.password && <span style={{ fontSize: '0.8rem', color: 'var(--pv-red, #ff4d4d)', marginTop: '5px' }}>{errors.password.message}</span>}
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Xác nhận mật khẩu</label>
            <input 
              {...register("confirmPassword")}
              type="password" 
              placeholder="••••••••" 
              style={{ 
                width: '100%', padding: '15px', borderRadius: '8px', 
                border: `1px solid ${errors.confirmPassword ? 'var(--pv-red, #ff4d4d)' : 'var(--border-color)'}`, 
                background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' 
              }}
            />
            {errors.confirmPassword && <span style={{ fontSize: '0.8rem', color: 'var(--pv-red, #ff4d4d)', marginTop: '5px' }}>{errors.confirmPassword.message}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng Ký Ngay"}
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Đã có tài khoản? <Link href="/login" style={{ color: 'var(--accent-color)' }}>Đăng nhập</Link>
        </p>

      </div>
    </div>
  );
}
