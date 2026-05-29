export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === 'admin' ? session : null;
}

export async function GET(req) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Không có quyền truy cập' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const year = parseInt(searchParams.get('year')) || new Date().getFullYear();

  let connection;
  try {
    connection = await getConnection();

    // 1. Tổng quan
    const [[summary]] = await connection.execute(`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount END), 0)  AS total_revenue,
        COALESCE(SUM(CASE WHEN status = 'completed' AND YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE()) THEN total_amount END), 0) AS this_month,
        COUNT(*)                                                                  AS total_orders,
        SUM(status = 'completed')                                                 AS completed_orders,
        SUM(status = 'pending')                                                   AS pending_orders,
        SUM(status = 'cancelled')                                                 AS cancelled_orders,
        COALESCE(AVG(CASE WHEN status = 'completed' THEN total_amount END), 0)   AS avg_order_value
      FROM orders
    `);

    // 2. Doanh thu theo tháng (năm được chọn)
    const [monthly] = await connection.execute(`
      SELECT
        MONTH(created_at)    AS month,
        SUM(total_amount)    AS revenue,
        COUNT(*)             AS order_count
      FROM orders
      WHERE status = 'completed' AND YEAR(created_at) = ?
      GROUP BY MONTH(created_at)
      ORDER BY month
    `, [year]);

    // Điền đủ 12 tháng (tháng không có đơn = 0)
    const monthlyFull = Array.from({ length: 12 }, (_, i) => {
      const found = monthly.find(r => r.month === i + 1);
      return { month: i + 1, revenue: found ? parseFloat(found.revenue) : 0, order_count: found ? found.order_count : 0 };
    });

    // 3. Top 5 sản phẩm bán chạy
    const [topProducts] = await connection.execute(`
      SELECT
        p.name,
        p.price,
        SUM(oi.quantity)              AS total_sold,
        SUM(oi.quantity * oi.price)   AS total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // 4. Doanh thu theo danh mục
    const [byCategory] = await connection.execute(`
      SELECT
        p.category,
        SUM(oi.quantity * oi.price)   AS revenue,
        SUM(oi.quantity)              AS total_sold
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed'
      GROUP BY p.category
      ORDER BY revenue DESC
    `);

    // 5. Các năm có đơn hàng (cho dropdown chọn năm)
    const [years] = await connection.execute(`
      SELECT DISTINCT YEAR(created_at) AS year FROM orders ORDER BY year DESC
    `);

    return NextResponse.json({
      summary: {
        total_revenue:    parseFloat(summary.total_revenue),
        this_month:       parseFloat(summary.this_month),
        total_orders:     summary.total_orders,
        completed_orders: summary.completed_orders,
        pending_orders:   summary.pending_orders,
        cancelled_orders: summary.cancelled_orders,
        avg_order_value:  parseFloat(summary.avg_order_value),
      },
      monthly:     monthlyFull,
      topProducts: topProducts.map(p => ({ ...p, price: parseFloat(p.price), total_revenue: parseFloat(p.total_revenue) })),
      byCategory:  byCategory.map(c => ({ ...c, revenue: parseFloat(c.revenue) })),
      years:       years.map(r => r.year),
      year,
    });
  } catch (error) {
    console.error('Lỗi GET admin/revenue:', error);
    return NextResponse.json({ error: 'Lỗi server', details: error.message }, { status: 500 });
  } finally {
    if (connection) connection.release();
  }
}
