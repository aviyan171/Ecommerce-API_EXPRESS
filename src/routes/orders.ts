import express from 'express'
import { isAdmin } from '../middlewares/auth.js'
import { newOrder } from '../controllers/order.js'

const orderRouter = express.Router()

orderRouter.post('/new', newOrder)

export { orderRouter }
