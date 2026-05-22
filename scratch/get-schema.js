const { createPool } = require('mysql2/promise');
require('dotenv').config({ path: '.env' });

async function getOrdersSchema() {
  const connection = await createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT) || 3306,
  });

  try {
    const [rows] = await connection.execute("DESCRIBE orders");
    console.log(rows);
  } catch (error) {
    console.error(error);
  } finally {
    await connection.end();
  }
}

getOrdersSchema();
