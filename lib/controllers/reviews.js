const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', async (req, res) => {
    const review = await Review.insert({
      rating: req.body.rating,
      reviewer: req.body.reviewer,
      review: req.body.review,
      book: req.body.book,
    });
    res.json(review);
  })

  .get('/', async (req, res) => {
    const reviews = await Review.getAll();
    res.json(reviews);
  })

  .delete('/:id', async (req, res) => {
    const { id } = req.params;

    const reviews = await Review.delete(id);
    res.json(reviews);
  });
