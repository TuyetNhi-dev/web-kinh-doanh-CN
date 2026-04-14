import { getConnection } from './lib/db.js';

async function setupOrders() {
  const connection = await getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`orders\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`user_id\` INT,
        \`customer_name\` VARCHAR(255),
        \`customer_email\` VARCHAR(255),
        \`total_amount\` DECIMAL(15, 2) NOT NULL,
        \`status\` ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`order_items\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`order_id\` INT,
        \`product_id\` INT,
        \`quantity\` INT NOT NULL,
        \`price\` DECIMAL(15, 2) NOT NULL,
        FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`),
        FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`)
      )
    `);
    console.log("Orders tables created successfully.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    connection.release();
    process.exit(0);
  }
}

setupOrders();
