const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Review = require('../lib/models/Review');

describe('tests for the reviewers resource', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('Should create a reviews', async () => {
    const res = await request(app).post('/api/v1/reviews').send({
      rating: 2,
      reviewer: '1',
      review: 'Good',
      book: 20,
    });
    expect(res.body).toEqual({
      id: expect.any(String),
      rating: 2,
      reviewer: '1',
      review: 'Good',
      book: 20,
    });
  });
});
