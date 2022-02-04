const { Router } = require('express');
const Author = require('../models/Author');

module.exports = Router()
  .post('/', async (req, res) => {
    const author = await Author.insert({
      name: req.body.name,
      dob: req.body.dob,
      pob: req.body.pob,
    });
    const { bookIds } = req.body;
    await Promise.all(bookIds.map(async (id) => author.addBookById(id)));

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
