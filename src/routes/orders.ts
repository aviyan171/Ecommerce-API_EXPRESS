import express from 'express'
import { isAdmin } from '../middlewares/auth.js'
import { getAllOrders, getMyOrder, getOrderDetails, newOrder } from '../controllers/order.js'

const orderRouter = express.Router()

orderRouter.post('/new', newOrder)
orderRouter.get('/my-order', getMyOrder),
  orderRouter.get('/all-order', isAdmin('get all orders'), getAllOrders),
  orderRouter.route('/:orderId').get(getOrderDetails)

export { orderRouter }
