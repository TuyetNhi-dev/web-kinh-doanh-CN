import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const isLocal =
  !process.env.DB_HOST ||
  process.env.DB_HOST === "127.0.0.1" ||
  process.env.DB_HOST === "localhost";

async function createTable() {
  let connection;
  try {
    const config = {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: isLocal ? undefined : { rejectUnauthorized: false }
    };
    
    connection = await mysql.createConnection(config);
    console.log("Connected to DB, creating notifications table...");
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Table created successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    if (connection) await connection.end();
    process.exit();
  }
}

createTable();
