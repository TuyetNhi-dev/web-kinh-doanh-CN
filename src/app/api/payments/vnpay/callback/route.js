import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req) {
  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");

    connection = await getConnection();

    if (status === "success") {
      await connection.execute(
        "UPDATE orders SET status = 'paid', payment_info = ? WHERE id = ?",
        [JSON.stringify({ method: "vnpay", status: "success" }), orderId]
      );
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}&vnpay=success`);
    } else {
      await connection.execute(
        "UPDATE orders SET status = 'failed', payment_info = ? WHERE id = ?",
        [JSON.stringify({ method: "vnpay", status: "failed" }), orderId]
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
