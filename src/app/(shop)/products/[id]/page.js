import { getConnection } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductClient from "@/components/ProductClient";

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) return { title: "Sản phẩm không tồn tại" };
  
  return {
    title: `${product.name} | TechStore`,
    description: product.description,
  };
}

async function getProduct(id) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    return rows[0];
  } catch (error) {
    console.error("Lỗi lấy chi tiết sản phẩm:", error);
    return null;
  } finally {
    if (connection) connection.release();
  }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <ProductClient product={product} />
    </div>
  );
}
