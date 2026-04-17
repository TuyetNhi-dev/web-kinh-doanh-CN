import { NextResponse } from 'next/server';
import { getConnection } from '@/lib/db';

export async function GET() {
  const connection = await getConnection();
  try {
    // 1. Tổng số sản phẩm
<<<<<<< HEAD
    const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
    
    // 2. Tổng số khách hàng (loại trừ admin)
    const [customers] = await connection.execute("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
    
    // 3. Tổng số đơn hàng
    const [orders] = await connection.execute('SELECT COUNT(*) as count FROM orders');
    
    // 4. Tổng doanh thu (Chỉ tính đơn hàng đã hoàn thành)
    const [revenue] = await connection.execute("SELECT SUM(total_amount) as total FROM orders WHERE status = 'completed'");

    // 5. 5 Đơn hàng mới nhất
    const [columnCheck] = await connection.execute("SHOW COLUMNS FROM orders LIKE 'customer_name'");
    const hasCustomerName = columnCheck.length > 0;

    const selectFields = ['o.id', 'o.total_amount', 'o.status', 'o.created_at', 'u.full_name AS user_full_name', 'u.email AS user_email'];
    if (hasCustomerName) selectFields.unshift('o.customer_name');

    const [recentOrders] = await connection.execute(`
      SELECT ${selectFields.join(', ')}
      FROM orders o
      LEFT JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT 5
    `);

    const normalizedOrders = recentOrders.map((order) => ({
      id: order.id,
      customer_name: order.customer_name || order.user_full_name || 'Khách vãng lai',
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
    }));

=======
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

>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
    return NextResponse.json({
      stats: {
        totalProducts: products[0].count,
        totalCustomers: customers[0].count,
        totalOrders: orders[0].count,
        totalRevenue: revenue[0].total || 0,
      },
<<<<<<< HEAD
      recentOrders: normalizedOrders
    });
  } catch (error) {
    console.error('Lỗi lấy stats admin:', error);
    return NextResponse.json({ error: 'Lỗi server', details: error.message }, { status: 500 });
=======
      recentOrders
    });
  } catch (error) {
    console.error('Lỗi lấy stats admin:', error);
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267
  } finally {
    connection.release();
  }
}
