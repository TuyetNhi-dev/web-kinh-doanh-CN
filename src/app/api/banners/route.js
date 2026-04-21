import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    const [banners] = await connection.query('SELECT * FROM banners WHERE active = TRUE ORDER BY created_at DESC');
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Lỗi lấy danh sách banner:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
