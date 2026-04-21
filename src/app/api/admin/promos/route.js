import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin';
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  const connection = await getConnection();
  try {
    const [promos] = await connection.query('SELECT * FROM home_promos ORDER BY id ASC');
    return NextResponse.json(promos);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PUT(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  const connection = await getConnection();
  try {
    const data = await req.json();
    const { id, title, subtitle, gradient, button_text, link } = data;
    await connection.query(
      'UPDATE home_promos SET title = ?, subtitle = ?, gradient = ?, button_text = ?, link = ? WHERE id = ?',
      [title, subtitle, gradient, button_text, link, id]
    );
    return NextResponse.json({ message: 'Cập nhật promo thành công' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
