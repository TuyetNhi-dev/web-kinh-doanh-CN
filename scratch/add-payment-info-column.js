const { createPool } = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function addPaymentInfoColumn() {
  const connection = await createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
  });

  try {
    const [columns] = await connection.execute("SHOW COLUMNS FROM orders LIKE 'payment_info'");
    if (columns.length === 0) {
      await connection.execute("ALTER TABLE orders ADD COLUMN payment_info JSON;");
      console.log("Successfully added 'payment_info' column to 'orders' table.");
    } else {
      console.log("Column 'payment_info' already exists.");
    }
  } catch (error) {
    console.error("Error adding column:", error);
  } finally {
    await connection.end();
  }
}

addPaymentInfoColumn();
