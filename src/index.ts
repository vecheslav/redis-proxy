import Debug from 'debug'
import { config } from './config'
import { app } from './app'

const debug = Debug('proxy')
debug('👀 Proxy is starting...')

const run = async () => {
  debug(`Redis URL: ${config.redisUrl}`)
  debug(`Cache options: ${JSON.stringify(config.cacheOptions)}`)
}

run().then(() => {
  app.listen(config.port, () => {
    debug(`💉 Instance running at ${config.port} port`)
  })
})