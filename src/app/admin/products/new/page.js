"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
<<<<<<< HEAD
import toast from "react-hot-toast";
=======
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Laptop",
    stock_quantity: "",
    image_url: ""
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Hiển thị preview ngay lập tức
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Upload lên server
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body
      });
      const data = await res.json();
      if (data.url) {
        setFormData({ ...formData, image_url: data.url });
<<<<<<< HEAD
        toast.success("✓ Upload ảnh thành công!");
      } else {
        toast.error("Lỗi upload ảnh: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      toast.error("Lỗi upload ảnh: " + error.message);
=======
      }
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert("Lỗi upload ảnh, vui lòng thử lại!");
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    
    // Kiểm tra required fields
    if (!formData.name) {
      toast.error("Vui lòng nhập tên sản phẩm!");
      return;
    }
    if (!formData.price) {
      toast.error("Vui lòng nhập giá bán!");
      return;
    }
    if (!formData.stock_quantity) {
      toast.error("Vui lòng nhập số lượng tồn kho!");
      return;
    }

    setLoading(true);

    try {
      console.log("📤 Gửi dữ liệu:", formData);
=======
    setLoading(true);

    try {
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

<<<<<<< HEAD
      const responseData = await res.json();
      console.log("📥 Response:", responseData);

      if (res.ok) {
        toast.success("✓ Thêm sản phẩm thành công!");
        setTimeout(() => router.push("/admin/products"), 1000);
      } else {
        toast.error("Lỗi: " + (responseData.error || "Không thể thêm sản phẩm"));
      }
    } catch (error) {
      console.error("Lỗi submit:", error);
      toast.error("Lỗi: " + error.message);
=======
      if (res.ok) {
        router.push("/admin/products");
      } else {
        alert("Lỗi thêm sản phẩm!");
      }
    } catch (error) {
      console.error("Lỗi submit:", error);
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/admin/products" style={{ textDecoration: 'none', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <i className="fa-solid fa-arrow-left"></i>
          Quay lại danh sách
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h2 style={{ marginBottom: "25px", fontWeight: "700" }}>Thêm sản phẩm mới</h2>

        <div className="form-group">
          <label>Tên sản phẩm *</label>
          <input 
            type="text" 
            required 
            placeholder="Ví dụ: MacBook Pro 14 M3" 
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div className="form-group">
            <label>Danh mục</label>
            <select 
              className="form-control" 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Laptop">Laptop / Macbook</option>
              <option value="Smartphone">iPhone / Smartphone</option>
              <option value="Phụ Kiện">Phụ Kiện / Linh Kiện</option>
              <option value="Smartwatch">Smartwatch</option>
            </select>
          </div>
          <div className="form-group">
            <label>Số lượng tồn kho</label>
            <input 
              type="number" 
              required 
              placeholder="0" 
              className="form-control"
              value={formData.stock_quantity}
              onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Giá bán (VNĐ) *</label>
          <input 
            type="number" 
            required 
            placeholder="0" 
            className="form-control"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Mô tả sản phẩm</label>
          <textarea 
            rows="4" 
            className="form-control" 
            placeholder="Nhập chi tiết thông tin sản phẩm..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Hình ảnh sản phẩm</label>
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
            <div className="upload-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <i className="fa-regular fa-image" style={{ fontSize: "2rem", color: "#ccc" }}></i>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="form-control" 
                style={{ padding: "8px" }}
              />
              <p style={{ marginTop: "10px", fontSize: "0.85rem", color: "var(--admin-text-muted)" }}>
                Hỗ trợ: JPG, PNG, WEBP (Khuyên dùng 800x800px)
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid var(--admin-border)", textAlign: "right" }}>
          <Link href="/admin/products" style={{ marginRight: "20px", textDecoration: 'none', color: 'var(--admin-text-muted)', fontWeight: '600' }}>Hủy bỏ</Link>
          <button type="submit" className="btn-indigo" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
