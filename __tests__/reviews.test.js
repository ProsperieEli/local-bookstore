const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


describe('tests for the reviewers resource', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('Should create a review', async () => {
    //post an author and a book
    // const author1 = await request(app).post('/api/v1/authors').send({
    //   name: 'sample author',
    //   dob: '1972-01-01',
    //   pob: 'a place',
    // });

    // const book = await request(app)
    //   .post('/api/v1/books')
    //   .send({
    //     title: 'sample book',
    //     released: 1990,
    //     publisherId: '50',
    //     authorIds: [author1.body.id],
    //   });

    // const res = await request(app).get(`/api/v1/books/${book.body.id}`);

    const res = await request(app).post('/api/v1/reviews').send({
      rating: 2,
      reviewer: 1,
      review: 'Good',
      book: 1,
    });
    
    expect(res.body).toEqual({
      id: expect.any(String),
      rating: 2,
      reviewer: 1,
      review: 'Good',
      book: 1,
    });
  });
});
