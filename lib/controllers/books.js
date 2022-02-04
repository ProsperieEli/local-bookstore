const { Router } = require('express');
const Book = require('../models/Book');


module.exports = Router()
  .post('/', async (req, res) => {
    const book = await Book.insert({
      title: req.body.title,
      publisherId: req.body.publisherId,
      released: req.body.released,
    });

    const { authorIds } = req.body;
    await Promise.all(authorIds.map(async (id) => book.addAuthorById(id)));

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
