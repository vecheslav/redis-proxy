import { Request, Response, Router } from 'express'
import cache from './cache'
import redis from './redis'

export const router = Router()

// Cached GET
router.get('/:key', async ({ params }: Request, res: Response) => {
  try {
    const key = params.key
    let fromCache = true
    let value = cache.get(key) || null

    if (value === null) {
      value = await redis.get(key)
      value && cache.set(key, value)
      fromCache = false
    }

    res.send({ value, cache: fromCache })
  } catch (err) {
    res.status(500).json(err)
  }
})

// TODO: Unstable translate any commands from redis protocol
router.post('/', async ({ body }: Request, res: Response) => {
  try {
    const { cmd, args } = body
    if (!cmd) throw new Error('Invalid POST request')

    const result = await redis.run(cmd, args)

    res.send({
      result,
    })
  } catch (err) {
    res.status(500).json(err)
  }
})