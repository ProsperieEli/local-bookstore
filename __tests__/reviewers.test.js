const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Reviewer = require('../lib/models/Reviewer');

const testObj = { name: 'Siri', company:'Apple', reviews: [] };
const testObjTwo = { name: 'Alexa', company:'Amazon', reviews: [null] };


describe('tests for the reviewers resource', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });
  
  it('should be able to create a reviewer', async () => {
    const res = await Reviewer.insert(testObj);
    expect(res).toEqual({ id: expect.any(String), name: 'Siri', company:'Apple', reviews:[] });
  });

  it('should be able to get a reviewer by id', async () => {
    const reviewers = await Reviewer.insert(testObj);
    const res = await request(app).get(`/api/v1/reviewers/${reviewers.id}`);
    expect(res.body).toEqual({ id: expect.any(String), name: 'Siri', company:'Apple', reviews: [null] });
  });

  it('should be able to list all reviewers', async () => {
    await request(app)
      .post('/api/v1/reviewers')
      .send(testObj);
    
    expect(await Reviewer.getAll()).toEqual(expect.arrayContaining([{ id: expect.any(String), name: 'Siri', company:'Apple', reviews:[] }]));
  });

  it('should be able to update a reviewer', async () => {
    const { body } = await request(app)
      .post('/api/v1/reviewers')
      .send(testObj);
    
    const res = await request(app)
      .patch(`/api/v1/reviewers/${body.id}`)
      .send(testObjTwo);
    
    const expected = { id:expect.any(String), name: 'Alexa', company:'Amazon', reviews:[] };
    const expected2 = { id:expect.any(String), name: 'Alexa', company:'Amazon', reviews:[null] };

    expect(res.body).toEqual(expected);
    expect(await Reviewer.getById(body.id)).toEqual(expected2);
  });

  it('should be able to delete by id', async () => {
    const { body } = await request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'Alexa', company:'Amazon' });
    await request(app)
      .delete(`/api/v1/reviewers/${body.id}`);
    
    // expect(res.body).toEqual(body);
    expect(await Reviewer.getById(body.id)).toBeNull();
  });
});
