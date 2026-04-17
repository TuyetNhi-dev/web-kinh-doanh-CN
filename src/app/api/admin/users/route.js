import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    const [users] = await connection.execute(
      'SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return NextResponse.json(users);
  } catch (error) {
    console.error('Lỗi lấy danh sách khách hàng admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
