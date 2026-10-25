const pool = require('../config/database');
const columns = 'id, student_number, first_name, last_name, email, course, year_of_study, bio, created_at, updated_at';
const fields = ['student_number', 'first_name', 'last_name', 'email', 'course', 'year_of_study', 'bio'];

const list = async () => {
  const [rows] = await pool.execute(`SELECT ${columns} FROM student_profiles ORDER BY id DESC`);
  return rows;
};
const find = async id => {
  const [rows] = await pool.execute(`SELECT ${columns} FROM student_profiles WHERE id = ?`, [id]);
  return rows[0];
};
const create = async input => {
  const [result] = await pool.execute(
    `INSERT INTO student_profiles (${fields.join(', ')}) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    fields.map(field => input[field]),
  );
  return find(result.insertId);
};
const update = async (id, input) => {
  const [result] = await pool.execute(
    `UPDATE student_profiles SET ${fields.map(field => `${field} = ?`).join(', ')} WHERE id = ?`,
    [...fields.map(field => input[field]), id],
  );
  return result.affectedRows ? find(id) : undefined;
};
const remove = async id => {
  const [result] = await pool.execute('DELETE FROM student_profiles WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
module.exports = { list, find, create, update, remove };
