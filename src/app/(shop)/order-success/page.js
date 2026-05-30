"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

// ── VNPay response code messages (client-side display) ────────────────────────
const VNP_MESSAGES = {
  "00": "Giao dịch thành công",
  "24": "Khách hàng hủy giao dịch",
  "11": "Hết hạn thanh toán",
  "51": "Tài khoản không đủ số dư",
  "65": "Vượt hạn mức giao dịch trong ngày",
  "75": "Ngân hàng đang bảo trì",
};

function getVNPMessage(code) {
  return VNP_MESSAGES[code] || `Thanh toán thất bại (mã: ${code})`;
}

function StatusIcon({ isSuccess }) {
  return (
    <div style={{
      width: 88, height: 88, borderRadius: "50%", margin: "0 auto 24px",
      background: isSuccess
        ? "linear-gradient(135deg, #22c55e, #16a34a)"
        : "linear-gradient(135deg, #ef4444, #dc2626)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: isSuccess
        ? "0 8px 32px rgba(34,197,94,0.4)"
        : "0 8px 32px rgba(239,68,68,0.4)",
      animation: "popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275)",
    }}>
      <style>{`
        @keyframes popIn {
          from { transform: scale(0); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <i
        className={`fa-solid ${isSuccess ? "fa-circle-check" : "fa-circle-xmark"}`}
        style={{ fontSize: "2.5rem", color: "#fff" }}
      />
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      marginBottom: 10, gap: 16,
    }}>
      <span style={{ color: "var(--text-secondary)", flexShrink: 0 }}>{label}:</span>
      <span style={{
        fontWeight: highlight ? 700 : 500,
        color: highlight ? "var(--accent-color)" : "inherit",
        textAlign: "right",
      }}>
        {value}
      </span>
    </div>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL params
  const orderId       = searchParams.get("orderId");
  const vnpayStatus   = searchParams.get("vnpay");      // "success" | "fail"
  const vnpCode       = searchParams.get("code");       // VNPay response code
  const transId       = searchParams.get("transId");    // VNPay transaction ID
  const bankCode      = searchParams.get("bankCode");   // Bank code
  const errorType     = searchParams.get("error");      // server error type
  const urlAmount     = searchParams.get("amount");     // Fallback amount from VNPay

  // MoMo compat
  const resultCode    = searchParams.get("resultCode");
  const momoStatus    = searchParams.get("momo");

  const [order, setOrder]   = useState(null);
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
      } catch (err) {
        console.error("Lỗi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, router]);

  // Show toasts based on result
  useEffect(() => {
    if (vnpayStatus === "success") {
      toast.success("Thanh toán VNPay thành công!", { id: "vnpay-result", duration: 5000 });
    } else if (vnpayStatus === "fail") {
      const msg = vnpCode ? getVNPMessage(vnpCode) : "Thanh toán thất bại";
      toast.error(msg, { id: "vnpay-result", duration: 5000 });
    }
  }, [vnpayStatus, vnpCode]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
        <div className="loader" />
        <p style={{ marginTop: 16, color: "var(--text-secondary)" }}>Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  // Determine overall success
  const isSuccess =
    vnpayStatus === "success" ||
    resultCode === "0" ||
    momoStatus === "success" ||
    (order?.status === "processing") ||
    (order?.payment_method === "cod" && order?.status === "pending");

  // Parse payment info
  let paymentInfo = null;
  if (order?.payment_info) {
    try {
      paymentInfo = typeof order.payment_info === "string"
        ? JSON.parse(order.payment_info)
        : order.payment_info;
    } catch {}
  }

  const displayTransId = transId || paymentInfo?.transId;
  const displayBankCode = bankCode || paymentInfo?.bankCode;
  const displayResponseMsg = paymentInfo?.responseMsg;

  const statusLabel = {
    processing: "Đã thanh toán ✓",
    pending:    "Chờ xử lý",
    completed:  "Hoàn thành",
    cancelled:  "Đã hủy",
    failed:     "Thất bại",
  }[order?.status] || order?.status;

  const errorMessages = {
    signature_invalid: "Chữ ký không hợp lệ — giao dịch bị từ chối vì lý do bảo mật.",
    amount_mismatch:   "Số tiền không khớp — giao dịch bị từ chối.",
    order_not_found:   "Không tìm thấy đơn hàng.",
    server_error:      "Lỗi server khi xử lý kết quả thanh toán.",
    invalid_ref:       "Mã giao dịch không hợp lệ.",
  };

  return (
    <div className="container" style={{ padding: "80px 20px", textAlign: "center", minHeight: "70vh" }}>
      <div className="glass" style={{ maxWidth: 620, margin: "0 auto", padding: "50px 40px", borderRadius: 30 }}>
        
        <StatusIcon isSuccess={isSuccess} />

        {isSuccess ? (
          <>
            <h1 style={{ marginBottom: 10 }}>Đặt hàng thành công!</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: 32 }}>
              Cảm ơn bạn đã tin tưởng HBN TechStore. Đơn hàng đang được xử lý.
            </p>
          </>
        ) : (
          <>
            <h1 style={{ marginBottom: 10 }}>Thanh toán thất bại</h1>
            <p style={{ color: "var(--text-secondary)", marginBottom: 8 }}>
              {errorType
                ? errorMessages[errorType] || "Có lỗi xảy ra trong quá trình thanh toán."
                : vnpCode
                ? getVNPMessage(vnpCode)
                : `Đơn hàng #${orderId} chưa được thanh toán.`
              }
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: 32 }}>
              Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
            </p>
          </>
        )}

        {/* Order & Payment Info */}
        <div style={{
          textAlign: "left",
          background: "rgba(255,255,255,0.05)",
          padding: "24px",
          borderRadius: 16,
          marginBottom: 32,
        }}>
          <h3 style={{ marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            Thông tin đơn hàng
          </h3>
          <InfoRow label="Mã đơn hàng" value={orderId ? `#${orderId}` : null} highlight />
          <InfoRow label="Ngày đặt" value={order?.created_at ? new Date(order.created_at).toLocaleString("vi-VN") : null} />
          <InfoRow label="Phương thức" value={order?.payment_method?.toUpperCase()} />
          <InfoRow label="Trạng thái" value={statusLabel} highlight={isSuccess} />

          {/* VNPay-specific fields */}
          {displayTransId && (
            <InfoRow label="Mã giao dịch" value={displayTransId} highlight />
          )}
          {displayBankCode && (
            <InfoRow label="Ngân hàng" value={displayBankCode} />
          )}
          {displayResponseMsg && !isSuccess && (
            <InfoRow label="Lý do" value={displayResponseMsg} />
          )}

          {/* Shipping info */}
          {order && (
            <>
              <h3 style={{ marginTop: 20, marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                Thông tin giao hàng
              </h3>
              <InfoRow label="Người nhận" value={order.shipping_name || order.customer_name} />
              <InfoRow label="Số điện thoại" value={order.shipping_phone} />
              <InfoRow label="Địa chỉ" value={order.shipping_address} />
            </>
          )}

          {/* Products */}
          {order?.items?.length > 0 && (
            <>
              <h3 style={{ marginTop: 20, marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                Sản phẩm
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {order.items.map(item => (
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={item.image_url || "/placeholder.jpg"}
                        alt={item.name}
                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 6 }}
                      />
                      <div>
                        <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>{item.name || `#${item.product_id}`}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>SL: {item.quantity}</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700 }}>
                      {new Intl.NumberFormat("vi-VN").format(item.price * item.quantity)}đ
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border-color)", paddingTop: 16, marginTop: 8 }}>
            <span style={{ fontSize: "1.15rem", fontWeight: 700 }}>Tổng tiền:</span>
            <span style={{ fontWeight: 700, color: "var(--accent-color)", fontSize: "1.35rem" }}>
              {(() => {
                const amt = order?.total_amount != null
                  ? parseFloat(order.total_amount)
                  : urlAmount != null
                  ? parseFloat(urlAmount)
                  : null;
                return amt != null
                  ? new Intl.NumberFormat("vi-VN").format(amt) + "đ"
                  : "—đ";
              })()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 16 }}>
          {!isSuccess && (
            <button
              onClick={() => router.push("/checkout")}
              className="btn btn-primary"
              style={{ flex: 1, padding: "14px" }}
            >
              Thử lại
            </button>
          )}
          <button
            onClick={() => router.push("/")}
            className="btn"
            style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.1)", border: "1px solid var(--border-color)" }}
          >
            Về trang chủ
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="btn btn-primary"
            style={{ flex: 1, padding: "14px" }}
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: "100px 20px", textAlign: "center" }}>Đang tải...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
