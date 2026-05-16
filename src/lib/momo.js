import crypto from "crypto";

/**
 * Tạo signature cho MoMo
 * @param {Object} params - Các tham số cần ký
 * @param {string} secretKey - Secret key từ MoMo
 * @returns {string} signature
 */
export function createMoMoSignature(params, secretKey) {
  const rawSignature = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHmac("sha256", secretKey)
    .update(rawSignature)
    .digest("hex");
}

/**
 * Kiểm tra signature từ MoMo trả về
 * @param {Object} params - Các tham số MoMo trả về
 * @param {string} secretKey - Secret key từ MoMo
 * @returns {boolean}
 */
export function verifyMoMoSignature(params, secretKey) {
  const { signature, ...data } = params;
  const newSignature = createMoMoSignature(data, secretKey);
  return newSignature === signature;
}
