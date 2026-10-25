const fs = require('node:fs/promises');
const path = require('node:path');
const pool = require('../config/database');

async function migrate() {
  const connection = await pool.getConnection();
  let locked = false;
  try {
    const [locks] = await connection.query("SELECT GET_LOCK(CONCAT(DATABASE(), ':studentfolio:migrate'), 10) AS acquired");
    if (locks[0].acquired !== 1) throw new Error('Could not acquire migration lock.');
    locked = true;
    const [tables] = await connection.execute(
      'SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME IN (?, ?)',
      ['student_profiles', 'users'],
    );
    if (tables.length) throw new Error('Existing student_profiles or users table detected. Inspect its structure before migrating; no tables were changed.');
    const file = path.resolve(__dirname, '../database/migrations/001_create_student_profiles.up.sql');
    await connection.query(await fs.readFile(file, 'utf8'));
    console.log('Applied migration 001: created student_profiles.');
  } finally {
    if (locked) await connection.query("SELECT RELEASE_LOCK(CONCAT(DATABASE(), ':studentfolio:migrate'))");
    connection.release();
  }
}

migrate().catch(error => {
  console.error('Migration failed:', error.code || error.message);
  process.exitCode = 1;
}).finally(() => pool.end());
