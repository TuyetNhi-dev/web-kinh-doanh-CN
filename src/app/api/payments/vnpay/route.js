import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderId, amount, orderInfo } = await req.json();

    // Vì là Mock VNPay, chúng ta sẽ trả về một URL trỏ tới API mock của chúng ta
    // URL này sẽ dẫn người dùng tới một trang "giả lập" thanh toán VNPay
    
    const mockRedirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/vnpay?orderId=${orderId}&amount=${amount}`;

    return NextResponse.json({
      paymentUrl: mockRedirectUrl
    });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi mock vnpay" }, { status: 500 });
  }
}

/**
 * Endpoint này giả lập cổng thanh toán VNPay
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  // Trả về HTML giả lập trang thanh toán VNPay
  const html = `
    <html>
      <head>
        <title>VNPay Mock Payment Portal</title>
        <style>
          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; }
          .card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
          .btn { padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; margin: 10px; }
          .btn-success { background: #005baa; color: white; }
          .btn-fail { background: #e74c3c; color: white; }
          .logo { width: 150px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="card">
          <img src="https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAY.png" class="logo" />
          <h2>Cổng thanh toán VNPay (MOCK)</h2>
          <p>Đơn hàng: <strong>#${orderId}</strong></p>
          <p>Số tiền: <strong>${new Intl.NumberFormat('vi-VN').format(amount)}đ</strong></p>
          <hr/>
          <p>Bạn muốn kết quả thanh toán thế nào?</p>
          <button class="btn btn-success" onclick="window.location.href='/api/payments/vnpay/callback?orderId=${orderId}&status=success'">Thành công</button>
          <button class="btn btn-fail" onclick="window.location.href='/api/payments/vnpay/callback?orderId=${orderId}&status=fail'">Thất bại</button>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
