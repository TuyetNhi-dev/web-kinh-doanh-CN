import { getConnection } from '../../src/lib/db.js';

async function checkTables() {
  const connection = await getConnection();
  try {
    const [rows] = await connection.query('SHOW TABLES');
    console.log(JSON.stringify(rows));
  } catch (error) {
    console.error(error);
  } finally {
    connection.release();
    process.exit(0);
  }
}

checkTables();
