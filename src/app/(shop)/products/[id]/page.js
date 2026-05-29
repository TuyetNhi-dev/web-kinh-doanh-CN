import { getConnection } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductClient from "@/components/ProductClient";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  if (!product) {
    return { title: "Sản phẩm không tồn tại | HBN TechStore" };
  }

  const baseUrl     = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const canonical   = `${baseUrl}/products/${product.id}`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Mua ${product.name} chính hãng tại HBN TechStore. Bảo hành 12 tháng, giao hàng nhanh toàn quốc.`;

  return {
    title:       `${product.name} | HBN TechStore`,
    description,
    alternates:  { canonical },
    openGraph: {
      title:       `${product.name} | HBN TechStore`,
      description,
      url:         canonical,
      siteName:    "HBN TechStore",
      locale:      "vi_VN",
      type:        "website",
      ...(product.image_url && {
        images: [{ url: product.image_url, width: 800, height: 800, alt: product.name }],
      }),
    },
    twitter: {
      card:        "summary_large_image",
      title:       `${product.name} | HBN TechStore`,
      description,
      ...(product.image_url && { images: [product.image_url] }),
    },
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

async function getRelatedProducts(category, excludeId) {
  if (!category) return [];
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT id, name, price, image_url, category, discount_percent, is_flash_sale, description, stock_quantity
       FROM products
       WHERE category = ? AND id != ?
       ORDER BY RAND()
       LIMIT 6`,
      [category, excludeId]
    );
    return rows;
  } catch (error) {
    console.error("Lỗi lấy sản phẩm liên quan:", error);
    return [];
  } finally {
    if (connection) connection.release();
  }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.category, product.id);

  return (
    <div className="container" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <ProductClient product={product} />

      {/* Related products */}
      {related.length > 0 && (
        <section style={{ marginTop: "70px" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
            <i className="fa-solid fa-layer-group" style={{ color: "var(--brand-orange)" }}></i>
            Sản phẩm tương tự
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}>
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
