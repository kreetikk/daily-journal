const request = require('supertest')
const app = require('../app')

describe('public-routes', () => {
  it('GET / should return success', () =>
    request(app)
      .get('/api/v1/')
      .expect(200, JSON.stringify({ message: 'Hello' })))
})
