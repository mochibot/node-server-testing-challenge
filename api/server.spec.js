const request = require('supertest');
const bcrypt = require('bcryptjs');
const server = require('./server');
const db = require('../data/data-config');

describe('server', () => {
  it('tests are running with DB_ENV set to testing', () => {
    expect(process.env.DB_ENV).toBe('testing')
  })

  describe('GET /', () => {
    it('returns 200 OK', () => {
      return request(server)
        .get('/')
        .then(response => {
          expect(response.status).toBe(200);
        })
    })

    it('returns JSON', () => {
      return request(server)
        .get('/')
        .then(response => {
          expect(response.type).toMatch(/json/);
        })
    })
  })
})

describe('GET /api/users', () => {
  it('returns 200 OK', () => {
    return request(server)
      .get('/')
      .then(response => {
        expect(response.status).toBe(200);
      })
  })
  
  it('should return an array of users', () => {
    return request(server)
      .get('/api/users')
      .then(response => {
        expect(Array.isArray(response.body)).toBe(true)
      })
  })
})

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await db('users').truncate()  
  })

  it('should insert an user with status code 201', () => {
    request(server)
      .post('/api/auth/register')
      .send({
        username: 'username1',
        password: 'password1',
        department: 'testdept'
      })
      .then(response => {
        expect(response.body.username).toBe('username1')
        expect(response.status).toBe(201)
      })
  })

  it('should increase number of user by 1', async () => {
    const currNumUsers = await db('users')
    
    await request(server)
      .post('/api/auth/register')
      .send({
        username: 'username2',
        password: 'password2',
        department: 'testdept'
      })
    const newNumUsers = await db('users')
    expect(newNumUsers.length - currNumUsers.length).toBe(1)
  });
})


describe('DELETE /api/users/:id', () => {
  beforeEach(async () => {
    await db('users').truncate()  
  })

  it('should decrease number of user by 1', async () => {
    await db('users').insert({
      username: 'username3',
      password: 'password3',
      department: 'testdept'
    });
    
    const currNumUsers = await db('users')
    
    await request(server)
      .delete('/api/users/1')

    const newNumUsers = await db('users')
    expect(currNumUsers.length - newNumUsers.length).toBe(1)
  });

  it('should return remove users with status code 200', async () => {
    await db('users').insert({
      username: 'username4',
      password: 'password4',
      department: 'testdept'
    });

    return request(server)
      .delete('/api/users/1')
      .then(response => {
        expect(response.status).toBe(200)
      })
  })
})

describe('POST /login', () => {
  beforeEach(async () => {
    await db('users').truncate()
  })

  it('should return the token', async () => {
    await db('users').insert({
      username: 'username5',
      password: bcrypt.hashSync('password5', 12),
      department: 'testdept'
    });

    request(server)
      .post('/api/auth/login')
      .send({
        username: 'username5',
        password: 'password5',
      })
      .then(response => {
        expect(response.body).toHaveProperty('token')
      })
  })
})
