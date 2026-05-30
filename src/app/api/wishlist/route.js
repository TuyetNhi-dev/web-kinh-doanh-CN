export const dynamic = "force-dynamic";
import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/** GET /api/wishlist — returns the logged-in user's wishlisted products */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
  }

  let connection;
  try {
    connection = await getConnection();

    const [userRows] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [session.user.email]
    );
    if (userRows.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    const userId = userRows[0].id;

    const [rows] = await connection.execute(
      `SELECT w.product_id, p.name, p.price, p.image_url, p.category,
              p.discount_percent, p.is_flash_sale, p.stock_quantity
       FROM wishlists w
       JOIN products p ON p.id = w.product_id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC`,
      [userId]
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Wishlist GET error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

/** POST /api/wishlist — add a product to wishlist */
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
  }

  let connection;
  try {
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ message: "Thiếu productId." }, { status: 400 });
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
      "INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (?, ?)",
      [userId, productId]
    );

    return NextResponse.json({ message: "Đã thêm vào danh sách yêu thích." }, { status: 201 });
  } catch (error) {
    console.error("Wishlist POST error:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
