const pool = require('../utils/pool');

module.exports = class Publisher {
  id;
  name;
  city;
  state;
  country;
  books;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.city = row.city;
    this.state = row.state;
    this.country = row.country;
    this.books = row.books || [];
  }

  static async INSERT({ name, city, state, country }) {
    const { rows } = await pool.query(
      `
      INSERT INTO publishers (name, city, state, country) VALUES($1, $2, $3, $4)
      RETURNING * `,
      [name, city, state, country]
    );
    return new Publisher(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
      SELECT id, name FROM publishers`);
    return rows.map((row) => new Publisher(row));
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
      SELECT publishers.*,
      jsonb_agg(to_jsonb(books) - 'publisher_id' - 'released') AS books      
      FROM publishers
      LEFT JOIN books ON books.publisher_id = publishers.id 
      WHERE publishers.id=$1
      GROUP BY publishers.id
    `,
      [id]
    );
    if (!rows[0]) return null;
    return new Publisher(rows[0]);
  }
};
