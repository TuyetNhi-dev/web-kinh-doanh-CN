import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    // 1. Tổng số sản phẩm
    const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
    
    // 2. Tổng số khách hàng (loại trừ admin)
    const [customers] = await connection.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
    
    // 3. Tổng số đơn hàng
    const [orders] = await connection.query('SELECT COUNT(*) as count FROM orders');
    
    // 4. Tổng doanh thu (Chỉ tính đơn hàng đã hoàn thành)
    const [revenue] = await connection.query("SELECT SUM(total_amount) as total FROM orders WHERE status = 'completed'");

    // 5. 5 Đơn hàng mới nhất
    const [recentOrders] = await connection.query(`
      SELECT id, customer_name, total_amount, status, created_at 
      FROM orders 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    return NextResponse.json({
      stats: {
        totalProducts: products[0].count,
        totalCustomers: customers[0].count,
        totalOrders: orders[0].count,
        totalRevenue: revenue[0].total || 0,
      },
      recentOrders
    });
  } catch (error) {
    console.error('Lỗi lấy stats admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
