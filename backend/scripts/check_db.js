<<<<<<< HEAD
import { getConnection } from '../../src/lib/db.js';
=======
import { getConnection } from './lib/db.js';
>>>>>>> 82603becc7364de2c67f9704b28566c7fc19b267

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
