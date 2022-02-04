const pool = require('../utils/pool');
const Author = require('./Author');

module.exports = class Book {
  id;
  title;
  released;
  publisherId;
  authors;
  publishers;
  reviews;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.released = row.released;
    this.publisherId = row.publisher_id;
    this.authors = row.authors || [];
    this.publishers = row.publishers || [];
    this.reviews = row.reviews || [];
  }

  static async insert({ title, publisherId, released }) {
    const { rows } = await pool.query(
      'INSERT INTO books(title, publisher_id, released) VALUES ($1, $2, $3) RETURNING *',
      [title, publisherId, released]
    );

    return new Book(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `SELECT books.id, books.title, books.released,
      jsonb_agg(to_jsonb(publishers) - 'city' - 'state' - 'country') AS publishers
      FROM books
      LEFT JOIN publishers ON books.publisher_id = publishers.id
      GROUP BY books.id`
    );
    const book = rows.map((row) => new Book(row));

    const response = [
      {
        id: book[0].id,
        title: book[0].title,
        released: book[0].released,
        publisher: book[0].publishers,
      },
    ];
    return response;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `
        SELECT
          books.id, books.title, books.released,
          jsonb_agg(to_jsonb(authors) - 'dob' - 'pob') AS authors,
          jsonb_agg(to_jsonb(publishers) - 'city' - 'state' - 'country') AS publishers,
          jsonb_agg(to_jsonb(reviews) - 'book') AS reviews
        FROM books
        LEFT JOIN authors_books
        ON authors_books.book_id = books.id
        LEFT JOIN authors
        ON authors_books.author_id = authors.id
        LEFT JOIN publishers
        ON publishers.id = books.publisher_id
        LEFT JOIN reviews
        ON books.id = reviews.book
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
