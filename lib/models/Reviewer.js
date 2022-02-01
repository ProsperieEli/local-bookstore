const pool = require('../utils/pool');

module.exports = class Reviewer {
  id;
  name;
  company;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.company = row.company;
    
  }

  static async insert({ name, company }) {
    const { rows } = await pool.query(
      'INSERT INTO reviewers (name, company ) VALUES ($1, $2) RETURNING *;',
      [name, company]
    );
    return new Reviewer(rows[0]);
  } 
  

  static async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM reviewers'
    );
    return rows.map(row => new Reviewer(row));
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM reviewers WHERE id=$1;', [
      id,
    ]);
    
    if(!rows[0]) return null;
    return new Reviewer(rows[0]);
  }

  static async updateById(id, { name, company }) {
    const { rows } = await pool.query(
      'UPDATE reviewers SET name = $1, company = $2 WHERE id = $3 RETURNING *',
      [name, company, id]
    );
    return new Reviewer(rows[0]);
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM reviewers WHERE id = $1 RETURNING *;', [id]
    );
    if (!rows[0]) return null;
    return new Reviewer(rows[0]);
  }
};
