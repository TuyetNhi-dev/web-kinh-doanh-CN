const fs = require('fs');
const path = require('path');

// Load .env file FIRST, before importing db.js
if (!process.env.DB_HOST) {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      if (key && !key.startsWith('#')) {
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (e) {
    console.error('Could not load .env:', e.message);
  }
}

const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function resetAdminPassword() {
  const email = 'admin@techstore.com';
  const password = 'Admin@123456';
  const fullName = 'Admin TechStore';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✓ Hashed password:', hashedPassword);

    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const connection = await pool.getConnection();

    // Check columns
    const [columns] = await connection.execute("DESCRIBE users");
    console.log('\n📋 Users table columns:');
    columns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type})`);
    });

    // Delete existing admin
    await connection.execute('DELETE FROM users WHERE email = ?', [email]);
    console.log('\n✓ Deleted existing admin account');

    // Create new admin with password_hash
    await connection.execute(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, fullName, 'admin']
    );
    console.log('✓ New admin account created!');

    // Verify it was saved
    const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log('\n✅ Verified in DB:');
    console.log('  Email:', rows[0].email);
    console.log('  Full Name:', rows[0].full_name);
    console.log('  Role:', rows[0].role);
    console.log('  Password Hash:', rows[0].password_hash?.substring(0, 20) + '...');

    console.log('\n📧 Login with:');
    console.log('  Email: ' + email);
    console.log('  Password: ' + password);

    connection.release();
    pool.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
