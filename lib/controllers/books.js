const { Router } = require('express');
const Book = require('../models/Book');
const Author = require('../models/Author');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', async (req, res) => {
    const book = await Book.insert({
      title: req.body.title,
      publisherId: req.body.publisherId,
      released: req.body.released,
    });

    const { authorIds } = req.body;
    await Promise.all(
      authorIds.map(async (id) => {
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

        if (!rows[0]) return null;

        const author = new Author(rows[0]);

        if (!author) return null;

        await pool.query(
          'INSERT INTO authors_books(author_id, book_id) VALUES ($1, $2) RETURNING *',
          [id, book.id]
        );

        // if (!rows[0]) return null;
        book.authors = [...book.authors, { id: author.id, name: author.name }];
        return book;
      })
    );

    res.send(book);
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const book = await Book.getById(id);
    res.send(book);
  })

  .get('/', async (req, res) => {
    const books = await Book.getAll();
    res.send(books);
  });
