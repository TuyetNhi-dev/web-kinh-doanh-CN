import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    const [promos] = await connection.query('SELECT * FROM home_promos ORDER BY id ASC');
    return NextResponse.json(promos);
  } catch (error) {
    console.error('Lỗi lấy danh sách promo:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
