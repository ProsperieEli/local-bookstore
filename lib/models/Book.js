const pool = require('../utils/pool');
const Author = require('./Author');

module.exports = class Book {
  id;
  title;
  released;
  publisherId;
  authors;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.released = row.released;
    this.publisherId = row.publisher_id;
    this.authors = row.authors || [];
  }

  static async insert({ title, publisherId, released }) {
    const { rows } = await pool.query(
      'INSERT INTO books(title, publisher_id, released) VALUES ($1, $2, $3) RETURNING *',
      [title, publisherId, released]
    );

    return new Book(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT id, title, released FROM books;');
    const book = rows.map((row) => new Book(row));

    return book;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
        SELECT
          books.*,
          jsonb_agg(to_jsonb(authors) - 'dob' - 'pob') AS authors
        FROM books
        LEFT JOIN authors_books
        ON authors_books.book_id = books.id
        LEFT JOIN authors
        ON authors_books.author_id = authors.id
        LEFT JOIN publishers
        ON books.publisher_id = publishers.id
        WHERE books.id=$1
        GROUP BY books.id
      `,
      [id]
    );

    if (!rows[0]) return null;

    return new Book(rows[0]);
  }

  async addAuthorById(id) {
    // const author = await Author.getById(id);
    const { rows } = await pool.query(
      `
      SELECT
        authors.*,
        jsonb_agg(to_jsonb(books) - 'title' - 'released') AS books
      FROM authors
      LEFT JOIN authors_books
      ON authors_books.author_id = authors.id
      LEFT JOIN books
      ON authors_books.book_id = books.id
      WHERE authors.id=$1
      GROUP BY authors.id
    `,
      [id]
    );

    console.log(rows);

    if (!rows[0]) return null;

    const author = new Author(rows[0]);

    if (!author) return null;

    await pool.query(
      'INSERT INTO authors_books(author_id, book_id) VALUES ($1, $2) RETURNING *',
      [id, this.id]
    );

    // if (!rows[0]) return null;
    this.authors = [...this.authors, { id: author.id, name: author.name }];
    return this;
  }
};
