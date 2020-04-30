// Own implementation of LRU
import LRU from './lru'
// TODO: Or you can import LRU from 'lru-cache'
// import LRU from 'lru-cache'
import { config } from '../config'

export default new LRU({
  ...config.cacheOptions,
  // TODO: Custom cache options
})
