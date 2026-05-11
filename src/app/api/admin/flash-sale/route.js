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
    const [products] = await connection.query('SELECT id, name, price, is_flash_sale, discount_percent, flash_sale_stock FROM products');
    return NextResponse.json(products);
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
    const { id, is_flash_sale, discount_percent, flash_sale_stock } = data;
    await connection.query(
      'UPDATE products SET is_flash_sale = ?, discount_percent = ?, flash_sale_stock = ? WHERE id = ?',
      [is_flash_sale, discount_percent, flash_sale_stock, id]
    );
    return NextResponse.json({ message: 'Cập nhật Flash Sale thành công' });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
  } finally {
    connection.release();
  }
}
