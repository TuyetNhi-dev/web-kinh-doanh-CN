export const dynamic = 'force-dynamic';
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

    // ORDER BY logic (Must be AFTER all WHERE clauses)
    if (search) {
      query += ' ORDER BY CASE WHEN name LIKE ? THEN 0 ELSE 1 END';
      params.push(`${search}%`);
    } else if (sort === 'bestseller') {
      query += ' ORDER BY stock_quantity ASC, created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const limitVal = parseInt(searchParams.get('limit') || '20');
    const pageVal  = parseInt(searchParams.get('page') || '1');
    const offsetVal = (pageVal - 1) * limitVal;

    query += ` LIMIT ${limitVal} OFFSET ${offsetVal}`;

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
