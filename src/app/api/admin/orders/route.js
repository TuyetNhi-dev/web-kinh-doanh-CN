import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];

export async function GET() {
  const connection = await getConnection();
  try {
    const [customerNameColumns] = await connection.execute("SHOW COLUMNS FROM orders LIKE 'customer_name'");
    const [customerEmailColumns] = await connection.execute("SHOW COLUMNS FROM orders LIKE 'customer_email'");

    const selectFields = ['o.id', 'o.user_id', 'o.total_amount', 'o.status', 'o.created_at', 'u.full_name AS user_full_name', 'u.email AS user_email'];
    if (customerNameColumns.length > 0) selectFields.unshift('o.customer_name');
    if (customerEmailColumns.length > 0) selectFields.unshift('o.customer_email');

    const [orders] = await connection.execute(`
      SELECT ${selectFields.join(', ')}
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `);

    const result = orders.map((order) => ({
      ...order,
      customer_name: order.customer_name || order.user_full_name || 'Khách vãng lai',
      customer_email: order.customer_email || order.user_email || '-',
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error('Lỗi lấy đơn hàng admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}

export async function PATCH(req) {
  const connection = await getConnection();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const { status } = await req.json();

    if (!id) return NextResponse.json({ error: 'Thiếu ID đơn hàng' }, { status: 400 });
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Trạng thái không hợp lệ' }, { status: 400 });
    }

    await connection.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ message: 'Cập nhật trạng thái thành công', status });
  } catch (error) {
    console.error('Lỗi cập nhật đơn hàng admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
