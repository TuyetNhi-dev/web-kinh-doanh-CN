import { NextResponse } from "next/server";
import { createMoMoSignature } from "@/lib/momo";
import axios from "axios";

export async function POST(req) {
  try {
    const { orderId, amount, orderInfo } = await req.json();

    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const endpoint = process.env.MOMO_API_ENDPOINT;
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}`;
    const ipnUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payments/momo/callback`;
    const requestId = orderId + "_" + new Date().getTime();
    const requestType = "captureWallet";
    const extraData = ""; // Có thể gửi base64 encoded data

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    
    // Tạo chữ ký (signature)
    const crypto = require('crypto');
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      partnerName: "HBN TechStore",
      storeId: "HBNStore",
      requestId,
      amount: amount.toString(),
      orderId: orderId.toString(),
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi",
    };

    const response = await axios.post(endpoint, requestBody);

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("MoMo Payment Error:", error.response?.data || error.message);
    return NextResponse.json(
      { message: "Lỗi khi tạo giao dịch MoMo" },
      { status: 500 }
    );
  }
}
