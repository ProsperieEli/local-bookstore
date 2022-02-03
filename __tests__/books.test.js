const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Book = require('../lib/models/Book');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to create a book', async () => {
    const res = await request(app)
      .post('/api/v1/books')
      .send({
        title: 'sample book',
        released: 1972,
        publisher: 'sample publisher',
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'sample book',
      released: 1972,
      publisher: 'sample publisher',
    });
  });

  it('should be able to list a book by id', async () => {
    const book = await Book.insert({ title: 'sample book' });
    const res = await request(app).get(`/api/v1/books/${book.id}`);

    expect(res.body).toEqual(book);
  });

  it('should be able to list books', async () => {
    await Book.insert({ title: 'sample book' });
    const res = await request(app).get('/api/v1/books');

    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          title: 'sample book',
        },
      ])
    );
  });
});
