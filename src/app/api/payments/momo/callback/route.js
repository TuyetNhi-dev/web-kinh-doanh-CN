import { NextResponse } from "next/server";
import { verifyMoMoSignature } from "@/lib/momo";
import { getConnection } from "@/lib/db";

export async function POST(req) {
  let connection;
  try {
    const body = await req.json();
    console.log("MoMo IPN Callback:", body);

    const secretKey = process.env.MOMO_SECRET_KEY;
    const isValid = verifyMoMoSignature(body, secretKey);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    const { orderId, resultCode, message } = body;

    connection = await getConnection();
    
    // resultCode = 0 means success
    if (resultCode === 0) {
      await connection.execute(
        "UPDATE orders SET status = 'paid', payment_info = ? WHERE id = ?",
        [JSON.stringify(body), orderId]
      );
      console.log(`Order ${orderId} marked as PAID via MoMo`);
    } else {
      await connection.execute(
        "UPDATE orders SET status = 'failed', payment_info = ? WHERE id = ?",
        [JSON.stringify(body), orderId]
      );
      console.log(`Order ${orderId} marked as FAILED via MoMo: ${message}`);
    }

    // MoMo yêu cầu return 204 No Content hoặc 200 OK
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("MoMo Callback Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

// MoMo cũng có thể gọi GET redirectUrl, nhưng mình xử lý ở trang thành công phía client.
