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
    const [banners] = await connection.query('SELECT * FROM banners ORDER BY created_at DESC');
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  const connection = await getConnection();
  try {
    const data = await req.json();
    const { image_url, title, subtitle, link } = data;
    const [result] = await connection.query(
      'INSERT INTO banners (image_url, title, subtitle, link) VALUES (?, ?, ?, ?)',
      [image_url, title, subtitle, link]
    );
    return NextResponse.json({ id: result.insertId, message: 'Thêm banner thành công' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function DELETE(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  const connection = await getConnection();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await connection.query('DELETE FROM banners WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Xóa banner thành công' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
