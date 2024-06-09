import express from 'express'
import { isAdmin } from '../middlewares/auth.js'
import { deleteOrder, getAllOrders, getMyOrder, getOrderDetails, newOrder, processOrder } from '../controllers/order.js'

const orderRouter = express.Router()

orderRouter.post('/new', newOrder)
orderRouter.get('/my-order', getMyOrder),
  orderRouter.get('/all-order', isAdmin('get all orders'), getAllOrders),
  orderRouter
    .route('/:orderId')
    .get(getOrderDetails)
    .put(isAdmin('process order'), processOrder)
    .delete(isAdmin('delete order'), deleteOrder)

export { orderRouter }
