import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') return false;
  return true;
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  const connection = await getConnection();
  try {
    const [users] = await connection.query(`
      SELECT u.id, u.full_name, u.email, u.role, u.created_at,
             COUNT(o.id) AS order_count,
             COALESCE(SUM(o.total_amount), 0) AS total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PATCH(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  const connection = await getConnection();
  try {
    const { id, role } = await req.json();
    if (!['admin', 'customer'].includes(role)) {
      return NextResponse.json({ error: 'Vai trò không hợp lệ' }, { status: 400 });
    }
    await connection.execute('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    return NextResponse.json({ message: 'Cập nhật vai trò thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật người dùng:', error);
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
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Lỗi xóa người dùng:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
