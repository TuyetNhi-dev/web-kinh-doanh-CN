import { getConnection } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute('SELECT * FROM products ORDER BY created_at DESC');
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
