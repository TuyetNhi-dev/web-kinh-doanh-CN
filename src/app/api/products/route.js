import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
  let connection;
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const sale = searchParams.get('sale');

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (sale === 'true') {
      query += ' AND (is_flash_sale = 1 OR discount_percent > 0)';
    }

    if (sort === 'bestseller') {
      query += ' ORDER BY stock_quantity ASC, created_at DESC';
    } else if (sort === 'newest') {
      query += ' ORDER BY created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    connection = await getConnection();
    const [rows] = await connection.execute(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Lỗi lấy danh sách sản phẩm:', error);
    return NextResponse.json(
      { message: 'Lỗi server khi lấy dữ liệu sản phẩm.' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
