export const dynamic = "force-dynamic";
import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/** DELETE /api/wishlist/[productId] — remove a product from wishlist */
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
  }

  let connection;
  try {
    const productId = parseInt(params.productId, 10);
    if (isNaN(productId)) {
      return NextResponse.json({ message: "productId không hợp lệ." }, { status: 400 });
    }

    connection = await getConnection();

    const [userRows] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [session.user.email]
    );
    if (userRows.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy user." }, { status: 404 });
    }
    const userId = userRows[0].id;

    await connection.execute(
      "DELETE FROM wishlists WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    return NextResponse.json({ message: "Đã xoá khỏi danh sách yêu thích." });
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
