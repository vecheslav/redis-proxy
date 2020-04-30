// Connect to backing redis
// TODO: it's can be moved as "on demand"
import { createClient } from 'redis'
import { config } from './config'

const client = createClient(config.redisUrl)

const get = (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => client.get(key, (err, reply) => (err ? reject(err) : resolve(reply))))
}

const run = (cmd, args): Promise<any> => {
  return new Promise((resolve, reject) => client[cmd](...args, (err, reply) => (err ? reject(err) : resolve(reply))))
}

export default {
  client,
  get,
  run,
}