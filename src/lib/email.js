import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password (không phải mật khẩu tài khoản)
  },
});

/**
 * Gửi email
 * @param {{ to: string, subject: string, html: string }} options
 */
export async function sendEmail({ to, subject, html }) {
  await transporter.sendMail({
    from: `"HBN TechStore" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

/**
 * Template email đặt lại mật khẩu
 * @param {{ resetLink: string, expiresAt: Date }} param
 */
export function buildResetPasswordEmail({ resetLink, expiresAt }) {
  const expiresStr = expiresAt.toLocaleString("vi-VN");
  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Đặt lại mật khẩu</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(90deg,#f57224,#ff8a44);padding:30px 40px;text-align:center;">
                  <h1 style="margin:0;color:#fff;font-size:1.6rem;font-weight:800;letter-spacing:-0.5px;">HBN TechStore</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:0.9rem;">Đặt lại mật khẩu của bạn</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 16px;color:#333;font-size:1rem;line-height:1.6;">Xin chào,</p>
                  <p style="margin:0 0 24px;color:#555;font-size:0.95rem;line-height:1.6;">
                    Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                    Nhấn vào nút bên dưới để tiến hành:
                  </p>
                  <div style="text-align:center;margin:32px 0;">
                    <a href="${resetLink}"
                       style="display:inline-block;background:#f57224;color:#fff;padding:14px 36px;border-radius:30px;font-size:1rem;font-weight:700;text-decoration:none;letter-spacing:0.3px;">
                      Đặt lại mật khẩu
                    </a>
                  </div>
                  <p style="margin:0 0 8px;color:#888;font-size:0.85rem;">
                    Liên kết sẽ hết hạn lúc: <strong style="color:#333;">${expiresStr}</strong>
                  </p>
                  <p style="margin:0;color:#888;font-size:0.85rem;">
                    Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.
                  </p>
                  <hr style="border:none;border-top:1px solid #f0f0f0;margin:32px 0;" />
                  <p style="margin:0;color:#bbb;font-size:0.78rem;text-align:center;">
                    © ${new Date().getFullYear()} HBN TechStore. Mọi quyền được bảo lưu.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Template email xác nhận đơn hàng
 * @param {{ orderId: number, customerName: string, totalAmount: number, items: Array }} param
 */
export function buildOrderConfirmEmail({ orderId, customerName, totalAmount, items }) {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;color:#333;font-size:0.9rem;">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;color:#555;font-size:0.9rem;text-align:center;">x${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f5f5f5;color:#f57224;font-size:0.9rem;text-align:right;font-weight:700;">
          ${parseFloat(item.price).toLocaleString("vi-VN")} đ
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Xác nhận đơn hàng #${orderId}</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:Inter,Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(90deg,#f57224,#ff8a44);padding:30px 40px;text-align:center;">
                  <h1 style="margin:0;color:#fff;font-size:1.6rem;font-weight:800;">HBN TechStore</h1>
                  <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:0.9rem;">Xác nhận đơn hàng #${orderId}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:40px;">
                  <p style="margin:0 0 16px;color:#333;font-size:1rem;">Xin chào <strong>${customerName}</strong>,</p>
                  <p style="margin:0 0 24px;color:#555;font-size:0.95rem;line-height:1.6;">
                    Đơn hàng <strong>#${orderId}</strong> của bạn đã được đặt thành công. Chúng tôi sẽ liên hệ sớm để xác nhận giao hàng.
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                    <tr>
                      <th style="text-align:left;padding-bottom:8px;color:#888;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #f0f0f0;">Sản phẩm</th>
                      <th style="text-align:center;padding-bottom:8px;color:#888;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #f0f0f0;">SL</th>
                      <th style="text-align:right;padding-bottom:8px;color:#888;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #f0f0f0;">Giá</th>
                    </tr>
                    ${itemRows}
                    <tr>
                      <td colspan="2" style="padding-top:16px;font-weight:700;color:#333;font-size:1rem;">Tổng cộng</td>
                      <td style="padding-top:16px;font-weight:800;color:#f57224;font-size:1.1rem;text-align:right;">
                        ${parseFloat(totalAmount).toLocaleString("vi-VN")} đ
                      </td>
                    </tr>
                  </table>
                  <hr style="border:none;border-top:1px solid #f0f0f0;margin:24px 0;" />
                  <p style="margin:0;color:#bbb;font-size:0.78rem;text-align:center;">
                    © ${new Date().getFullYear()} HBN TechStore. Mọi quyền được bảo lưu.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
