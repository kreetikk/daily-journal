const request = require('supertest')

const app = require('../app')
const saveToFile = require('../utils/saveToFile')

jest.mock('../utils/saveToFile', () => jest.fn())

jest.mock('../../db.json', () => ({
  '1': {
    title: 'My first test journal',
    content: 'This is my first test journal',
    createdAt: '2019-08-26T01:24:08.440Z',
    updatedAt: '2019-08-26T01:24:08.440Z',
    isDeleted: false,
    id: 1,
  },
  '2': {
    title: 'My second test journal',
    content: 'This is my second test journal',
    createdAt: '2019-08-26T01:25:34.072Z',
    updatedAt: '2019-08-26T01:25:34.072Z',
    isDeleted: false,
    id: 2,
  },
}))

describe('protected routes', () => {
  describe('GET /journals', () => {
    it('GET /journals - success', async () => {
      const { body } = await request(app).get('/api/v1/journals')
      expect(body).toEqual([
        {
          title: 'My first test journal',
          content: 'This is my first test journal',
          createdAt: '2019-08-26T01:24:08.440Z',
          updatedAt: '2019-08-26T01:24:08.440Z',
          isDeleted: false,
          id: 1,
        },
        {
          title: 'My second test journal',
          content: 'This is my second test journal',
          createdAt: '2019-08-26T01:25:34.072Z',
          updatedAt: '2019-08-26T01:25:34.072Z',
          isDeleted: false,
          id: 2,
        },
      ])
    })
  })

  describe('GET /journals/id', () => {
    it('GET /journals/1 - success', async () => {
      const { body, status } = await request(app).get('/api/v1/journals/1')
      expect(status).toEqual(200)
      expect(body).toEqual({
        title: 'My first test journal',
        content: 'This is my first test journal',
        createdAt: '2019-08-26T01:24:08.440Z',
        updatedAt: '2019-08-26T01:24:08.440Z',
        isDeleted: false,
        id: 1,
      })
    })

    it('GET /journals/5 - error', async () => {
      const { body, status } = await request(app).get('/api/v1/journals/5')
      expect(status).toEqual(400)
      expect(body).toEqual({
        error: 'Journal not found',
      })
    })
  })

  describe('POST /journals', () => {
    it('POST /journals - success', async () => {
      const req = {
        title: 'My third test journal',
        content: 'Ok, I feel great',
      }
      const { body, status } = await request(app)
        .post('/api/v1/journals')
        .send(req)
      expect(status).toEqual(201)
      expect(body.id).toEqual(3)
      expect(body.title).toEqual(req.title)
      expect(body.content).toEqual(req.content)
    })

    it('POST /journals - error', async () => {
      const req = {
        content: 'Ok, I feel great great',
      }
      const { body, status } = await request(app)
        .post('/api/v1/journals')
        .send(req)
      expect(status).toEqual(400)
      expect(body.errors.length).toEqual(1)
    })
  })

  describe('PUT /journals/1', () => {
    it('PUT /journals/1 - success', async () => {
      const req = {
        title: 'My first first first test journal',
        content: 'Ok, I feel great',
      }
      const { body, status } = await request(app)
        .put('/api/v1/journals/1')
        .send(req)
      expect(status).toEqual(200)
      expect(body.title).toEqual(req.title)
      expect(body.content).toEqual(req.content)
    })
  })
})
