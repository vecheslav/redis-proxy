export const config = {
  redisUrl: process.env.REDIS_URL,
  port: +process.env.port || 4000,
  cacheOptions: {
    max: +process.env.CACHE_CAPACITY || 1000,
    maxAge: +process.env.CACHE_EXPIRE_TIME || 1000 * 60,
  },
}