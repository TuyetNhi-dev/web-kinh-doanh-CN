"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";

// Define Validation Schema with Zod
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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.full_name,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(result.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '40px', textAlign: 'center' }}>
        
        <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Tham Gia HBN TechStore</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Tạo tài khoản để trải nghiệm mua sắm tốt nhất tại HBN TechStore</p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Họ tên</label>
            <input 
              {...register("full_name")}
              type="text" 
              placeholder="Nhập họ và tên..." 
              style={{ 
                width: '100%', 
                padding: '12px 15px', 
                borderRadius: '8px', 
                border: `1px solid ${errors.full_name ? '#ff4d4d' : 'var(--border-color)'}`, 
                background: 'rgba(0,0,0,0.3)', 
                color: 'white', 
                outline: 'none' 
              }}
            />
            {errors.full_name && <span style={{ fontSize: '0.8rem', color: '#ff4d4d', marginTop: '5px' }}>{errors.full_name.message}</span>}
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email</label>
            <input 
              {...register("email")}
              type="email" 
              placeholder="example@gmail.com" 
              style={{ 
                width: '100%', 
                padding: '12px 15px', 
                borderRadius: '8px', 
                border: `1px solid ${errors.email ? '#ff4d4d' : 'var(--border-color)'}`, 
                background: 'rgba(0,0,0,0.3)', 
                color: 'white', 
                outline: 'none' 
              }}
            />
            {errors.email && <span style={{ fontSize: '0.8rem', color: '#ff4d4d', marginTop: '5px' }}>{errors.email.message}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mật khẩu</label>
              <input 
                {...register("password")}
                type="password" 
                placeholder="••••••••" 
                style={{ 
                  width: '100%', 
                  padding: '12px 15px', 
                  borderRadius: '8px', 
                  border: `1px solid ${errors.password ? '#ff4d4d' : 'var(--border-color)'}`, 
                  background: 'rgba(0,0,0,0.3)', 
                  color: 'white', 
                  outline: 'none' 
                }}
              />
              {errors.password && <span style={{ fontSize: '0.8rem', color: '#ff4d4d', marginTop: '5px' }}>{errors.password.message}</span>}
            </div>

            <div style={{ textAlign: 'left' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Xác nhận</label>
              <input 
                {...register("confirmPassword")}
                type="password" 
                placeholder="••••••••" 
                style={{ 
                  width: '100%', 
                  padding: '12px 15px', 
                  borderRadius: '8px', 
                  border: `1px solid ${errors.confirmPassword ? '#ff4d4d' : 'var(--border-color)'}`, 
                  background: 'rgba(0,0,0,0.3)', 
                  color: 'white', 
                  outline: 'none' 
                }}
              />
              {errors.confirmPassword && <span style={{ fontSize: '0.8rem', color: '#ff4d4d', marginTop: '5px' }}>{errors.confirmPassword.message}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ padding: '15px', fontSize: '1.1rem', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng Ký Tài Khoản"}
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Đã có tài khoản? <Link href="/login" style={{ color: 'var(--accent-color)' }}>Đăng nhập ngay</Link>
        </p>

      </div>
    </div>
  );
}
