import express from 'express'
import { router } from './routes'

// Worker
export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', router)
app.use('/', (req, res) => {
  res.send({ status: 'UP' })
})