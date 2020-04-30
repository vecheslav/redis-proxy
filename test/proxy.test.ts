import request from 'supertest'
import { app } from '../src/app'
import redis from '../src/redis'

afterAll(async () => {
  await new Promise((resolve) => redis.client.quit(() => resolve()))
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise(resolve => setImmediate(resolve))
})

describe('Proxy', () => {
  describe('Check status', () => {
    it('should status 200 for instance', async () => {
      const { status } = await request(app).get('/')
      expect(status).toBe(200)
    })
  })

  describe('SET', () => {
    it('should error for invalid args', async () => {
      const { status } = await request(app)
        .post('/')
        .send({ cmd: 'SET', args: [] })
      expect(status).toBe(500)
    })

    it('should result OK', async () => {
      const { body } = await request(app)
        .post('/')
        .send({ cmd: 'SET', args: ['test', 'v0'] })
      expect(body.result).toBe('OK')
    })
  })

  describe('GET', () => {
    it('should status 200 for some key', async () => {
      const { status } = await request(app).get('/some-key')
      expect(status).toBe(200)
    })

    it('should return correct value for exist key', async () => {
      const { body } = await request(app).get('/test')
      expect(body.value).toBe('v0')
      expect(body.cache).toBe(false)
    })

    it('should return the same value from cache', async () => {
      const { body } = await request(app).get('/test')
      expect(body.cache).toBe(true)
    })

    it('should expired', async () => {
      // Add time
      const now = Date.now()
      jest.spyOn(Date, 'now').mockImplementation(() => now + 1000 * 61)

      const { body } = await request(app).get('/test')
      expect(body.cache).toBe(false)
    })
  })
})

