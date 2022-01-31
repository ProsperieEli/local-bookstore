const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');

const testObj = { name: 'Siri', company:'Apple' };
const testObjTwo = { name: 'Alexa', company:'Amazon' };


describe('tests for the reviewers resource', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });
  
  it('should be able to create an reviewer', async () => {
    const res = await Reviewer.insert(testObj);
    expect(res).toEqual({ id: expect.any(String), name: 'Siri', company:'Apple' });
  });

  it('should be able to get an reviewer by id', async () => {
    const reviewers = await Reviewer.insert(testObj);
    const res = await request(app).get(`/api/v1/reviewers/${reviewers.id}`);
    expect(res.body).toEqual(reviewers);
  });

  it('should be able to list all reviewers', async () => {
    await request(app)
      .post('/api/v1/reviewers')
      .send(testObj);
    
    expect(await Reviewer.getAll()).toEqual([{ id: expect.any(String), name: 'Siri', company:'Apple' }]);
  });

  it('should be able to update an reviewer', async () => {
    const reviewers = await request(app)
      .post('/api/v1/reviewers')
      .send(testObj);
    
    const res = await request(app)
      .put(`/api/v1/reviewers/${reviewers.id}`)
      .send(testObjTwo);
    
    const expected = { id: reviewers.id, name: 'Alexa', company:'Amazon'  };

    expect(res.body).toEqual(expected);
    expect(await Reviewer.getById(reviewers.id)).toEqual(expected);
  });
  it('should be able to delete by id', async () => {
    const reviewer = await request(app)
      .post('/api/v1/reviewers')
      .send(testObj);
    const res = await request(app)
      .delete(`/api/v1/reviewers/${reviewer.id}`);
    
    expect(res.body).toEqual(reviewer);
    expect(await Reviewer.getById(reviewer.id)).toBeNull();
  });
});
