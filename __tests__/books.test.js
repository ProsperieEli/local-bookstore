const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


describe('backend routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });


  it('should be able to create a book with a specified author', async () => {
    //first post some authors
    const author1 = await request(app).post('/api/v1/authors').send({
      name: 'Jessica Hagedorn',
      dob: '1972-01-01',
      pob: 'The Philippines',
      bookIds: []
    });

    const author2 = await request(app).post('/api/v1/authors').send({
      name: 'Frantz Fanon',
      dob: '1930-01-01',
      pob: 'A city',
      bookIds: []
    });
    
    //then post a book with an authorIds array
    const res = await request(app)
      .post('/api/v1/books')
      .send({
        title: 'book w multi authors',
        released: 1990,
        publisherId: '30',
        authorIds: [author1.body.id, author2.body.id],
      });

    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'book w multi authors',
      released: 1990,
      publisherId: '30',
      authors: [
        { id: author1.body.id, name: author1.body.name },
        { id: author2.body.id, name: author2.body.name },
      ],
    });
  });

  it('should be able to list a book by id', async () => {
    const author1 = await request(app).post('/api/v1/authors').send({
      name: 'sample author',
      dob: '1972-01-01',
      pob: 'a place',
    });
    
    const book = await request(app)
      .post('/api/v1/books')
      .send({
        title: 'sample book',
        released: 1990,
        publisherId: '50',
        authorIds: [author1.body.id],
      });
    

    const res = await request(app).get(`/api/v1/books/${book.body.id}`);

    expect(res.body).toEqual({
      id: String(book.body.id),
      title: 'sample book',
      released: 1990,
      publisherId: '50',
      authors: [
        {
          id: expect.any(Number),
          name: 'sample author',
        },
      ],
    });
  });

  it('should be able to list books', async () => {
    const res = await request(app).get('/api/v1/books');

    expect(res.body).toEqual(
      expect.arrayContaining([
        { authors: [], id: '1', released: 2021, title: 'Coffee Memoirs' },
      ])
    );
  });
});
