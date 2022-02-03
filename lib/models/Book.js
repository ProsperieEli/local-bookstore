const pool = require('../utils/pool');

module.exports = class Book {
  id;
  title;
  released;
  publisher;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.released = row.released;
    this.publisher = row.publisher;
  }

  static async insert({ title, released, publisher, authorIds }) {
    const { rows } = await pool.query(
      'INSERT INTO books(title, released, publisher) VALUES ($1, $2, $3) RETURNING *;',
      [title, released, publisher],
      'INSERT INTO books_authors(book_id)'
    );
    const book = new Book(rows[0]);
    // map thru authorIds array to insert a row per author id w the book id
    // await pool.query(
    //     book.id PLUS authorID gets inserted into books_authors
    // )
    return book;
  }

  //instance method addAuthor

  static async getAll() {
    const { rows } = await pool.query('SELECT id, title, released FROM books;');
    const book = rows.map((row) => new Book(row));

    return book;
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM books WHERE id=$1;', [id]);

    if (!rows[0]) return null;
    const book = new Book(rows[0]);

    return book;
  }
};
