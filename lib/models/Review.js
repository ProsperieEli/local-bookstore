const pool = require('../utils/pool');

module.exports = class Review {
  id;
  rating;
  reviewer;
  review;
  book;

  constructor(row) {
    this.id = row.id;
    this.rating = row.rating;
    this.reviewer = row.reviewer;
    this.review = row.review;
    this.book = row.book;
  }

  static async insert({ rating, reviewer, review, book }) {
    const { rows } = await pool.query(
      `
      INSERT INTO reviews (rating, reviewer, review, book) VALUES($1, $2, $3, $4) RETURNING *`,
      [rating, reviewer, review, book]
    );

    return new Review(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(`
      SELECT reviews.*,
      RANK() OVER (ORDER BY rating DESC)
      FROM reviews
      GROUP BY reviews.id
      ORDER BY RANK ASC
      LIMIT 100
      `);
    return rows.map((row) => new Review(row));
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `
  DELETE FROM reviews WHERE id=$1
  RETURNING *`,
      [id]
    );

    if (!rows[0]) return null;
    return new Review(rows[0]);
  }
};
