import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req) {
  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");

    connection = await getConnection();

    const transId = "VNP" + Date.now().toString().slice(-8);

    if (status === "success") {
      await connection.execute(
        "UPDATE orders SET status = 'processing', payment_info = ? WHERE id = ?",
        [JSON.stringify({ method: "vnpay", status: "success", transId }), orderId]
      );
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}&vnpay=success&transId=${transId}`);
    } else {
      await connection.execute(
        "UPDATE orders SET status = 'cancelled', payment_info = ? WHERE id = ?",
        [JSON.stringify({ method: "vnpay", status: "failed", transId }), orderId]
      );
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}&vnpay=fail`);
    }
  } catch (error) {
    console.error("VNPay Mock Callback Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
