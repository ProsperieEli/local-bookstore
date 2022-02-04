const { Router } = require('express');
const { check } = require('prettier');
const Reviewer = require('../models/Reviewer');


module.exports = Router()
  .post('/', async (req, res) => {
    const reviewer = await Reviewer.insert(req.body);
    res.json(reviewer);
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const reviewer = await Reviewer.getById(id);
    res.json(reviewer);
  })

  .get('/', async (req, res) => {
    const reviewer = await Reviewer.getAll();
    res.json(reviewer);
  })

  .patch('/:id', async (req, res, next) => {
    const { id } = req.params;
    const { name, company } = req.body;
   
    try {
      const reviewer = await Reviewer.updateById(id, { name, company });
      res.json(reviewer);
    } catch(err) {
      next(err);
    }
  })

  .delete('/:id', async (req, res) => {
    try {
      const checkReviewer = await Reviewer.getById(req.params.id);
      const { reviews } = checkReviewer;
      if(reviews.length !== 0) { return null;
      } else 
        await Reviewer.deleteById(req.params.id);
      res.json(checkReviewer);
    } catch(err) {
      res(err);
    }
  });
