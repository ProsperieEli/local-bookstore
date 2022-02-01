const pool = require('../utils/pool');

module.exports = class Author {
  id;
  name;
  dob;
  pob;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.dob = row.dob;
    this.pob = row.pob;
  }

  static async insert({ name, dob, pob }) {
    const { rows } = await pool.query(
      'INSERT INTO authors(name, dob, pob) VALUES ($1, $2, $3) RETURNING *;',
      [name, dob, pob]
    );
    const author = new Author(rows[0]);
    return author;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT id, name FROM authors;');
    const author = rows.map((row) => new Author(row));

    return author;
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM authors WHERE id=$1;', [
      id,
    ]);

    if (!rows[0]) return null;
    const author = new Author(rows[0]);

    return author;
  }
};
