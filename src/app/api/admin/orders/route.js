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
    const [orders] = await connection.query(`
      SELECT o.id, o.user_id, o.total_amount, o.status, o.created_at,
             u.full_name, u.email,
             COUNT(oi.id) AS item_count
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Lỗi lấy đơn hàng:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PATCH(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  const connection = await getConnection();
  try {
    const { id, status } = await req.json();
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
    }
    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ message: 'Cập nhật trạng thái thành công' });
  } catch (error) {
    console.error('Lỗi cập nhật đơn hàng:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function GET_DETAIL(req) {
  const connection = await getConnection();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const [items] = await connection.query(`
      SELECT oi.*, p.name AS product_name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [id]);
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
