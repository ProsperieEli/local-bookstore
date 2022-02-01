const { Router } = require('express');
const Publisher = require('../models/Publisher');

module.exports = Router()
  .post('/', async (req, res) => {
    const publish = await Publisher.INSERT({
      name: req.body.name,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    });
    res.json(publish);
  })

  .get('/', async (req, res) => {
    const publish = await Publisher.getAll();

    res.json(publish);
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const publish = await Publisher.getById(id);

    res.json(publish);
  });
