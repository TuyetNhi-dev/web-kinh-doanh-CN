"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

function StarRating({ rating, onRate, interactive = false, size = "1.2rem" }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={star <= rating ? "fa-solid fa-star" : "fa-regular fa-star"}
          style={{
            color: star <= rating ? "#f59e0b" : "rgba(255,255,255,0.2)",
            cursor: interactive ? "pointer" : "default",
            fontSize: size,
            transition: "transform 0.15s",
          }}
          onClick={() => interactive && onRate(star)}
          onMouseEnter={(e) => interactive && (e.target.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => interactive && (e.target.style.transform = "scale(1)")}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      const data = await res.json();
      if (data.reviews) {
        setReviews(data.reviews);
        setAvgRating(data.avgRating);
        setTotalReviews(data.totalReviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newRating === 0) {
      toast.error("Vui lòng chọn số sao!");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating: newRating, comment: newComment }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setNewRating(0);
        setNewComment("");
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Lỗi khi gửi đánh giá.");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ marginTop: "50px" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "30px", display: "flex", alignItems: "center", gap: "12px" }}>
        <i className="fa-solid fa-star" style={{ color: "#f59e0b" }}></i>
        Đánh Giá Sản Phẩm
      </h2>

      {/* Summary */}
      <div className="glass" style={{ display: "flex", alignItems: "center", gap: "30px", padding: "25px", borderRadius: "16px", marginBottom: "30px", flexWrap: "wrap" }}>
        <div style={{ textAlign: "center", minWidth: "100px" }}>
          <div style={{ fontSize: "3rem", fontWeight: 800, color: "#f59e0b" }}>{avgRating || "—"}</div>
          <StarRating rating={Math.round(avgRating)} size="1rem" />
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "5px" }}>{totalReviews} đánh giá</p>
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                <span style={{ fontSize: "0.85rem", width: "40px" }}>{star} sao</span>
                <div style={{ flex: 1, height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${percent}%`, height: "100%", background: "#f59e0b", borderRadius: "4px", transition: "width 0.3s" }} />
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", width: "30px" }}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Form */}
      {session ? (
        <form onSubmit={handleSubmit} className="glass" style={{ padding: "25px", borderRadius: "16px", marginBottom: "30px" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "15px" }}>Viết đánh giá của bạn</h3>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Đánh giá sao</label>
            <StarRating rating={newRating} onRate={setNewRating} interactive size="1.8rem" />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>Nhận xét (tùy chọn)</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "rgba(255,255,255,0.05)",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                outline: "none",
                resize: "vertical",
              }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: "10px 30px" }} disabled={submitting}>
            {submitting ? "Đang gửi..." : "Gửi Đánh Giá"}
          </button>
        </form>
      ) : (
        <div className="glass" style={{ padding: "20px", borderRadius: "12px", marginBottom: "30px", textAlign: "center", color: "var(--text-secondary)" }}>
          <a href="/login" style={{ color: "var(--brand-orange)", fontWeight: 600 }}>Đăng nhập</a> để viết đánh giá.
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <p style={{ color: "var(--text-secondary)" }}>Đang tải đánh giá...</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "30px 0" }}>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {reviews.map((review) => (
            <div key={review.id} className="glass" style={{ padding: "20px", borderRadius: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{
                  width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(135deg, var(--brand-orange), #ff6b35)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.85rem"
                }}>
                  {getInitials(review.full_name)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, marginBottom: "3px" }}>{review.full_name || "Ẩn danh"}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <StarRating rating={review.rating} size="0.85rem" />
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      {new Date(review.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              </div>
              {review.comment && (
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.95rem" }}>{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
