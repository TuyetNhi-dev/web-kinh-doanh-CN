import crypto from "crypto";

/**
 * MoMo v2 payment library (Sandbox).
 *
 * Reference: https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
 *
 * Env vars required:
 *   MOMO_PARTNER_CODE   — e.g. "MOMO"
 *   MOMO_ACCESS_KEY     — from MoMo Developer dashboard
 *   MOMO_SECRET_KEY     — from MoMo Developer dashboard
 *   MOMO_IPN_URL        — full URL MoMo will POST the payment result to
 *   NEXT_PUBLIC_BASE_URL — base URL of this app
 */

const MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";

/**
 * Build the raw signature string for MoMo v2.
 * MoMo requires exactly these fields in alphabetical order.
 */
function buildRawSignature(fields) {
  return [
    `accessKey=${fields.accessKey}`,
    `amount=${fields.amount}`,
    `extraData=${fields.extraData}`,
    `ipnUrl=${fields.ipnUrl}`,
    `orderId=${fields.orderId}`,
    `orderInfo=${fields.orderInfo}`,
    `partnerCode=${fields.partnerCode}`,
    `redirectUrl=${fields.redirectUrl}`,
    `requestId=${fields.requestId}`,
    `requestType=${fields.requestType}`,
  ].join("&");
}

/**
 * HMAC-SHA256 over a string.
 */
function hmac256(secretKey, data) {
  return crypto.createHmac("sha256", secretKey).update(data).digest("hex");
}

/**
 * Create a MoMo Sandbox payment request.
 * Returns the parsed JSON from MoMo (includes `payUrl` on success).
 *
 * @param {{ orderId: number|string, amount: number, orderInfo?: string }} opts
 * @returns {Promise<{ payUrl: string, requestId: string, [key: string]: any }>}
 */
export async function createMoMoPayment({ orderId, amount, orderInfo }) {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey   = process.env.MOMO_ACCESS_KEY;
  const secretKey   = process.env.MOMO_SECRET_KEY;
  const baseUrl     = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (!partnerCode || !accessKey || !secretKey) {
    throw new Error("MoMo credentials are not configured (MOMO_PARTNER_CODE / MOMO_ACCESS_KEY / MOMO_SECRET_KEY).");
  }

  const requestId   = `${partnerCode}-${orderId}-${Date.now()}`;
  const redirectUrl = `${baseUrl}/api/payments/momo/callback`;
  const ipnUrl      = process.env.MOMO_IPN_URL || `${baseUrl}/api/payments/momo/callback`;
  const requestType = "captureWallet";
  const extraData   = "";

  const rawSignature = buildRawSignature({
    accessKey,
    amount: String(amount),
    extraData,
    ipnUrl,
    orderId: String(orderId),
    orderInfo: orderInfo || `Thanh toan don hang #${orderId}`,
    partnerCode,
    redirectUrl,
    requestId,
    requestType,
  });

  const signature = hmac256(secretKey, rawSignature);

  const body = {
    partnerCode,
    accessKey,
    requestId,
    amount:      String(amount),
    orderId:     String(orderId),
    orderInfo:   orderInfo || `Thanh toan don hang #${orderId}`,
    redirectUrl,
    ipnUrl,
    lang:        "vi",
    extraData,
    requestType,
    signature,
  };

  const response = await fetch(MOMO_ENDPOINT, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`MoMo API returned HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Verify a MoMo IPN / redirect callback signature.
 *
 * MoMo sends these fields back; the signature is computed over the same
 * alphabetically-sorted subset.
 *
 * @param {Object} params - All query/body params from MoMo
 * @returns {boolean}
 */
export function verifyMoMoCallback(params) {
  const secretKey = process.env.MOMO_SECRET_KEY;
  const {
    accessKey, amount, extraData, message, orderId, orderInfo,
    orderType, partnerCode, payType, requestId, responseTime,
    resultCode, transId,
  } = params;

  // MoMo callback signature string (alphabetical)
  const rawSignature = [
    `accessKey=${accessKey}`,
    `amount=${amount}`,
    `extraData=${extraData}`,
    `message=${message}`,
    `orderId=${orderId}`,
    `orderInfo=${orderInfo}`,
    `orderType=${orderType}`,
    `partnerCode=${partnerCode}`,
    `payType=${payType}`,
    `requestId=${requestId}`,
    `responseTime=${responseTime}`,
    `resultCode=${resultCode}`,
    `transId=${transId}`,
  ].join("&");

  const expected = hmac256(secretKey, rawSignature);
  return expected === params.signature;
}

/**
 * Map MoMo resultCode to a Vietnamese user-facing message.
 * @param {string|number} code
 * @returns {string}
 */
export function getMoMoResponseMessage(code) {
  const messages = {
    0:    "Giao dịch thành công",
    10:   "Hệ thống đang bảo trì",
    11:   "Dịch vụ bị từ chối",
    12:   "Phiên bản API không hỗ trợ",
    13:   "Xác thực doanh nghiệp thất bại",
    20:   "Yêu cầu không hợp lệ",
    21:   "Số tiền không đủ",
    22:   "Số tiền không hợp lệ",
    23:   "Khách hàng bị từ chối giao dịch",
    24:   "Giao dịch đã bị hủy",
    25:   "Giao dịch thất bại",
    26:   "Giao dịch thất bại (OTP không hợp lệ)",
    27:   "Giao dịch thất bại (OTP hết hạn)",
    28:   "Giao dịch thất bại (khóa ví MoMo)",
    29:   "Giao dịch thất bại (quá hạn mức)",
    1001: "Giao dịch thất bại (số dư không đủ)",
    1002: "Giao dịch bị từ chối bởi nhà phát hành",
    1003: "Giao dịch đã hoàn tiền",
    1004: "Số tiền giao dịch vượt quá hạn mức",
    1005: "URL giao dịch đã hết hạn",
    1006: "Giao dịch bị từ chối",
    1007: "Tài khoản không tồn tại",
    1026: "Giao dịch bị hạn chế theo quy định MoMo",
    1080: "Giao dịch hoàn tiền thất bại",
    1081: "Số tiền hoàn thấp hơn mức tối thiểu",
    2001: "Giao dịch thất bại (sai thông tin liên kết)",
    2007: "Giao dịch đang chờ thanh toán",
    3001: "Thanh toán thất bại (từ chối xác nhận)",
    3002: "Giao dịch bị giới hạn",
    4001: "Giao dịch bị hạn chế do chưa xác minh thông tin",
    4010: "Xác minh OTP thất bại",
    4011: "OTP chưa được gửi hoặc đã hết hạn",
    4100: "Đăng nhập thất bại",
    4015: "Vượt quá số lần xác nhận OTP",
    9000: "Giao dịch đã được xác nhận thành công",
  };
  return messages[Number(code)] || `Lỗi không xác định (mã ${code})`;
}
