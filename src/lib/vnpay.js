/**
 * VNPay Service - Real Sandbox Integration
 * Implements HMAC-SHA512 signature for secure payment URL creation and verification.
 * All secrets are loaded from environment variables — never hardcoded.
 */

import crypto from "crypto";

// ─── Config (from environment variables) ────────────────────────────────────
const VNP_TMNCODE    = process.env.VNP_TMNCODE;
const VNP_HASHSECRET = process.env.VNP_HASHSECRET;
const VNP_URL        = process.env.VNP_URL        || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNP_RETURNURL  = process.env.VNP_RETURNURL  || "http://localhost:3000/api/vnpay_return";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Sort object keys alphabetically (required by VNPay spec).
 */
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

/**
 * Compute HMAC-SHA512 over the query string using the hash secret.
 * @param {string} data  - URL-encoded query string (without leading ?)
 * @returns {string}     - Hex-encoded HMAC-SHA512 digest
 */
function hmacSHA512(data) {
  return crypto
    .createHmac("sha512", VNP_HASHSECRET)
    .update(Buffer.from(data, "utf-8"))
    .digest("hex");
}

/**
 * Format a Date to VNPay's yyyyMMddHHmmss format (local Vietnam time).
 */
function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  const y  = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d  = pad(date.getDate());
  const h  = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s  = pad(date.getSeconds());
  return `${y}${mo}${d}${h}${mi}${s}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build a real VNPay payment URL.
 *
 * @param {object} params
 * @param {number|string} params.orderId     - Your internal order ID
 * @param {number}        params.amount      - Amount in VND (integer, e.g. 150000)
 * @param {string}        params.orderInfo   - Description shown on VNPay page
 * @param {string}        params.ipAddr      - Client IP address
 * @param {string}        [params.locale]    - "vn" or "en" (default "vn")
 * @param {string}        [params.bankCode]  - Pre-select bank (optional)
 * @returns {string}  Full VNPay payment URL with valid HMAC-SHA512 signature
 */
export function createPaymentUrl({ orderId, amount, orderInfo, ipAddr, locale = "vn", bankCode = "" }) {
  if (!VNP_TMNCODE || !VNP_HASHSECRET) {
    throw new Error("VNPay credentials not configured. Check VNP_TMNCODE and VNP_HASHSECRET in .env");
  }

  const now     = new Date();
  const txnRef  = `${orderId}-${Date.now()}`; // Unique transaction reference
  const createDate = formatDate(now);

  // Expire after 15 minutes
  const expireDate = new Date(now.getTime() + 15 * 60 * 1000);

  const vnpParams = {
    vnp_Version:     "2.1.0",
    vnp_Command:     "pay",
    vnp_TmnCode:     VNP_TMNCODE,
    vnp_Locale:      locale,
    vnp_CurrCode:    "VND",
    vnp_TxnRef:      String(txnRef),
    vnp_OrderInfo:   orderInfo,
    vnp_OrderType:   "other",
    vnp_Amount:      String(Math.round(amount) * 100),  // VNPay uses amount * 100
    vnp_ReturnUrl:   VNP_RETURNURL,
    vnp_IpAddr:      ipAddr || "127.0.0.1",
    vnp_CreateDate:  createDate,
    vnp_ExpireDate:  formatDate(expireDate),
  };

  if (bankCode) {
    vnpParams.vnp_BankCode = bankCode;
  }

  // Sort params alphabetically — required by VNPay
  const sortedParams = sortObject(vnpParams);

  // Build query string
  const queryString = new URLSearchParams(sortedParams).toString();

  // Compute HMAC-SHA512 signature
  const secureHash = hmacSHA512(queryString);

  return `${VNP_URL}?${queryString}&vnp_SecureHash=${secureHash}`;
}

/**
 * Verify the HMAC-SHA512 signature on VNPay's return/IPN URL parameters.
 *
 * @param {object} params  - All query parameters from the return URL (as plain object)
 * @returns {{ valid: boolean, responseCode: string, txnRef: string, amount: number, bankCode: string, transactionId: string, payDate: string }}
 */
export function verifyReturnUrl(params) {
  // Extract and remove the hash from params before recomputing
  const { vnp_SecureHash, vnp_SecureHashType, ...restParams } = params;

  // Sort remaining params
  const sortedParams = sortObject(restParams);

  // Rebuild query string
  const queryString = new URLSearchParams(sortedParams).toString();

  // Recompute signature
  const expectedHash = hmacSHA512(queryString);

  const valid = vnp_SecureHash?.toLowerCase() === expectedHash.toLowerCase();

  // Parse VNPay response fields
  const responseCode   = params.vnp_ResponseCode  || "";
  const txnRef         = params.vnp_TxnRef         || "";
  const transactionId  = params.vnp_TransactionNo  || "";
  const bankCode       = params.vnp_BankCode        || "";
  const payDate        = params.vnp_PayDate         || "";
  // VNPay amount is * 100, divide to get actual VND
  const amount         = parseInt(params.vnp_Amount || "0") / 100;

  return {
    valid,
    responseCode,
    txnRef,
    amount,
    bankCode,
    transactionId,
    payDate,
    orderInfo: params.vnp_OrderInfo || "",
  };
}

/**
 * Map VNPay response codes to human-readable Vietnamese messages.
 */
export function getResponseMessage(code) {
  const messages = {
    "00": "Giao dịch thành công",
    "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)",
    "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking",
    "10": "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
    "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán",
    "12": "Giao dịch không thành công do: Thẻ/Tài khoản bị khóa",
    "13": "Giao dịch không thành công do: Quý khách nhập sai mật khẩu xác thực (OTP)",
    "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
    "51": "Giao dịch không thành công do: Tài khoản không đủ số dư",
    "65": "Giao dịch không thành công do: Tài khoản vượt hạn mức giao dịch trong ngày",
    "75": "Ngân hàng thanh toán đang bảo trì",
    "79": "Giao dịch không thành công do: Nhập sai mật khẩu thanh toán quá số lần quy định",
    "99": "Lỗi không xác định",
  };
  return messages[code] || `Lỗi không xác định (mã: ${code})`;
}
