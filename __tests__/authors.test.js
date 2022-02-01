const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Author = require('../lib/models/Author');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should be able to create a author', async () => {
    const res = await request(app)
      .post('/api/v1/authors')
      .send({ name: 'sample author', dob: '1900-11-22', pob: 'sample pob' });

    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'sample author',
      dob: expect.stringContaining('1900-11-22'),
      pob: 'sample pob',
    });
  });

  it('should be able to list a author by id', async () => {
    const author = await Author.insert({ name: 'sample author' });
    const res = await request(app).get(`/api/v1/authors/${author.id}`);

    expect(res.body).toEqual(author);
  });

  it('should be able to list authors', async () => {
    await Author.insert({ name: 'sample author' });
    const res = await request(app).get('/api/v1/authors');

    expect(res.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(String),
          name: 'sample author',
        },
      ])
    );
  });
});