export const dynamic = 'force-dynamic';
import { getConnection } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ message: "Thiếu productId." }, { status: 400 });
    }

    connection = await getConnection();

    const [reviews] = await connection.execute(
      `SELECT r.id, r.rating, r.comment, r.created_at, u.full_name, u.email
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );

    // Calculate average rating
    const [avgResult] = await connection.execute(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
       FROM reviews WHERE product_id = ?`,
      [productId]
    );

    return NextResponse.json({
      reviews,
      avgRating: avgResult[0].avg_rating ? parseFloat(avgResult[0].avg_rating).toFixed(1) : 0,
      totalReviews: avgResult[0].total_reviews || 0,
    });
  } catch (error) {
    console.error("Lỗi lấy đánh giá:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(req) {
  let connection;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Vui lòng đăng nhập để đánh giá." }, { status: 401 });
    }

    const { productId, rating, comment } = await req.json();

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Dữ liệu không hợp lệ." }, { status: 400 });
    }

    connection = await getConnection();

    // Get user_id
    const [users] = await connection.execute(
      "SELECT id FROM users WHERE email = ?",
      [session.user.email]
    );

    if (users.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy user." }, { status: 404 });
    }

    const userId = users[0].id;

    // Check if user already reviewed this product
    const [existing] = await connection.execute(
      "SELECT id FROM reviews WHERE product_id = ? AND user_id = ?",
      [productId, userId]
    );

    if (existing.length > 0) {
      // Update existing review
      await connection.execute(
        "UPDATE reviews SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP WHERE product_id = ? AND user_id = ?",
        [rating, comment || null, productId, userId]
      );
      return NextResponse.json({ message: "Cập nhật đánh giá thành công!" });
    }

    // Insert new review
    await connection.execute(
      "INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)",
      [productId, userId, rating, comment || null]
    );

    return NextResponse.json({ message: "Đánh giá thành công!" }, { status: 201 });
  } catch (error) {
    console.error("Lỗi đánh giá:", error);
    return NextResponse.json({ message: "Lỗi server." }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
