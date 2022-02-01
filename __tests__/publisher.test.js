const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Publisher = require('../lib/models/Publisher');

describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should create a publisher', async () => {
    const res = await request(app).post('/api/v1/publishers').send({
      name: 'Elijah Prosperie',
      city: 'Seattle',
      state: 'Washington',
      country: 'United States',
    });
    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'Elijah Prosperie',
      city: 'Seattle',
      state: 'Washington',
      country: 'United States',
    });
  });

  it('should get the id', async () => {
    const publish = await Publisher.INSERT({
      name: 'Elijah Prosperie',
      city: 'Seattle',
      state: 'Washington',
      country: 'United States',
    });
    const res = await request(app).get(`/api/v1/publishers/${publish.id}`);
    expect(res.body).toEqual(publish);
  });

  it('should get all published', async () => {
    const publish = await Publisher.INSERT({
      name: 'Elijah Prosperie',
      city: 'Seattle',
      state: 'Washington',
      country: 'United States',
    });
    const res = await request(app).get('/api/v1/publishers');
    expect(res.body).toEqual(expect.arrayContaining([publish]));
  });
});
