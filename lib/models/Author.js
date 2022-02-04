const pool = require('../utils/pool');
const Book = require('./Book');

module.exports = class Author {
  id;
  name;
  dob;
  pob;
  books;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.dob = row.dob;
    this.pob = row.pob;
    this.books = row.books || [];
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

    return author.map((item) => ({
      'id': item.id,
      'name': item.name,
    })
    );
  }

  static async getById(id) {
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

    if (!rows[0]) return null;

    return new Author(rows[0]);
  }

  async addBookById(id) {
    // const book = await Book.getById(id);
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
        WHERE books.id=$1
        GROUP BY books.id
      `,
      [id]
    );

   

    if (!rows[0]) return null;

    const book = new Book(rows[0]);

    if (!book) return null;

    await pool.query(
      'INSERT INTO authors_books(author_id, book_id) VALUES ($1, $2) RETURNING *',
      [this.id, id]
    );

    // if (!rows[0]) return null;
    this.books = [...this.books, { id: book.id, name: book.name }];
    return this;
  }
};
