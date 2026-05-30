const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    console.log('Connecting to', process.env.DB_HOST);
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000 // 10 seconds timeout
    });
    console.log('Connected successfully!');
    const [rows] = await connection.execute('SHOW TABLES;');
    console.log('Tables:', rows);
    await connection.end();
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection();
