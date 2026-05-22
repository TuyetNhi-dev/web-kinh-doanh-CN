import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { orderId, amount, orderInfo } = await req.json();

    // Vì là Mock MoMo, chúng ta sẽ trả về một URL trỏ tới API mock của chúng ta
    const mockRedirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/momo?orderId=${orderId}&amount=${amount}`;

    return NextResponse.json({
      payUrl: mockRedirectUrl
    });
  } catch (error) {
    return NextResponse.json({ message: "Lỗi mock momo" }, { status: 500 });
  }
}

/**
 * Endpoint này giả lập cổng thanh toán MoMo
 */
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  // Trả về HTML giả lập trang thanh toán MoMo
  const html = `
    <!DOCTYPE html>
    <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thanh toán MoMo - TechStore</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: 'Inter', sans-serif; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh; 
            background: linear-gradient(135deg, #a50064 0%, #e6008b 100%);
            color: #333;
          }
          .glass-card { 
            background: rgba(255, 255, 255, 0.95); 
            padding: 40px; 
            border-radius: 24px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.2); 
            text-align: center; 
            max-width: 420px;
            width: 90%;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
          }
          .logo { width: 80px; height: 80px; margin-bottom: 20px; border-radius: 16px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
          h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 20px; color: #111; }
          .order-details {
            background: #fdf2f8;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: left;
            border: 1px solid #fbcfe8;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
          }
          .detail-row:last-child { margin-bottom: 0; }
          .detail-label { color: #831843; font-weight: 500; }
          .detail-value { color: #4c0519; font-weight: 700; }
          .price { color: #be185d; font-size: 1.2rem; }
          
          .action-text { margin-bottom: 20px; font-weight: 500; color: #831843; }
          
          .btn-container { display: flex; gap: 15px; flex-direction: column; }
          .btn { 
            padding: 16px 24px; 
            border: none; 
            border-radius: 12px; 
            cursor: pointer; 
            font-weight: 600; 
            font-size: 1rem;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
            width: 100%;
          }
          .btn-success { 
            background: linear-gradient(to right, #a50064, #d82d8b); 
            color: white; 
            box-shadow: 0 4px 15px rgba(165, 0, 100, 0.3);
          }
          .btn-success:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(165, 0, 100, 0.4); }
          .btn-fail { 
            background: #fce7f3; 
            color: #9d174d; 
          }
          .btn-fail:hover { background: #fbcfe8; color: #831843; }
        </style>
      </head>
      <body>
        <div class="glass-card">
          <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" class="logo" alt="MoMo" onerror="this.style.display='none'" />
          <h2>Cổng thanh toán MoMo</h2>
          
          <div class="order-details">
            <div class="detail-row">
              <span class="detail-label">Mã đơn hàng</span>
              <span class="detail-value">#${orderId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Số tiền thanh toán</span>
              <span class="detail-value price">${new Intl.NumberFormat('vi-VN').format(amount)}đ</span>
            </div>
          </div>
          
          <p class="action-text">Giả lập kết quả thanh toán cho đơn hàng này</p>
          
          <div class="btn-container">
            <button class="btn btn-success" onclick="window.location.href='/api/payments/momo/callback?orderId=${orderId}&status=success'">Xác nhận thanh toán thành công</button>
            <button class="btn btn-fail" onclick="window.location.href='/api/payments/momo/callback?orderId=${orderId}&status=fail'">Hủy giao dịch</button>
          </div>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
