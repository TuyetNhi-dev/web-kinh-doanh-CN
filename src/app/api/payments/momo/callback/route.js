import { NextResponse } from "next/server";
import { getConnection } from "@/lib/db";

export async function GET(req) {
  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");

    connection = await getConnection();

    const transId = "MOMO" + Date.now().toString().slice(-8);

    if (status === "success") {
      await connection.execute(
        "UPDATE orders SET status = 'processing', payment_info = ? WHERE id = ?",
        [JSON.stringify({ method: "momo", status: "success", transId }), orderId]
      );
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}&momo=success&transId=${transId}`);
    } else {
      await connection.execute(
        "UPDATE orders SET status = 'cancelled', payment_info = ? WHERE id = ?",
        [JSON.stringify({ method: "momo", status: "failed", transId }), orderId]
      );
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${orderId}&momo=fail`);
    }
  } catch (error) {
    console.error("MoMo Mock Callback Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
