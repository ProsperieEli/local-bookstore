const { Router } = require('express');
const Author = require('../models/Author');
const Book = require('../models/Book');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', async (req, res) => {
    const author = await Author.insert({
      name: req.body.name,
      dob: req.body.dob,
      pob: req.body.pob,
    });

    const { bookIds } = req.body;
    // await Promise.all(bookIds.map(async (id) => author.addBookById(id)));

    await Promise.all(
      bookIds.map(async (id) => {
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

        console.log('rows!', rows);

        if (!rows[0]) return null;

        const book = new Book(rows[0]);

        if (!book) return null;

        await pool.query(
          'INSERT INTO authors_books(author_id, book_id) VALUES ($1, $2) RETURNING *',
          [author.id, id]
        );

        // if (!rows[0]) return null;
        author.books = [...author.books, { id: book.id, name: book.name }];
        return author;
      })
    );

    res.send(author);
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const author = await Author.getById(id);
    res.send(author);
  })

  .get('/', async (req, res) => {
    const authors = await Author.getAll();
    res.send(authors);
  });
