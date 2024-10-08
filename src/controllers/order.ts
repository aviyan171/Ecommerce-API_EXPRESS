import { Request } from 'express'
import { TryCatch } from '../middlewares/error.js'
import { OrderTRquestBody } from '../types/order.js'
import { OrderModel } from '../models/Order.js'
import { customResponse, errorResponse, inValidateCache, isStockEmpty, reduceStock } from '../utils/common.js'
import { COMMON_MESSAGES } from '../constants/commonMessages.js'
import { VALIDATION_MESSAGES } from '../constants/validatonMessages.js'
import { ERROR_MESSAGES } from '../constants/errorMessages.js'
import { nodeCache } from '../app.js'
import { ESTATUS } from '../enum/order.js'

export const newOrder = TryCatch(async (req: Request<{}, {}, OrderTRquestBody>, res, next) => {
  const { shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total } = req.body
  if (await isStockEmpty(orderItems)) return errorResponse({ next, message: ERROR_MESSAGES.EMPTY_STOCK })
  if (!shippingInfo || !orderItems || !user || !subtotal || !tax || !total)
    errorResponse({ next, message: VALIDATION_MESSAGES.ADD_ALL_FIELDS })
  await OrderModel.create({
    shippingInfo,
    orderItems,
    user,
    subtotal,
    tax,
    shippingCharges,
    discount,
    total
  })
  await reduceStock(orderItems)
  await inValidateCache({ products: true, orders: true, admin: true, userId: user })

  return customResponse({ statusCode: 201, message: COMMON_MESSAGES.CREATE.replace('{{name}}', 'Order'), res })
})

export const getMyOrder = TryCatch(async (req, res, next) => {
  const { id } = req.query
  const key = `my-orders-${id}`
  let orders = []
  if (nodeCache.has(key)) {
    orders = JSON.parse(nodeCache.get(key) as string)
  } else {
    orders = await OrderModel.find({ user: id })
  }
  nodeCache.set(key, JSON.stringify(orders))

  return customResponse({
    statusCode: 200,
    res,
    data: orders,
    message: COMMON_MESSAGES.FETCH_SUCCESSFUL.replace('{{name}}', 'Your Order')
  })
})
export const getAllOrders = TryCatch(async (req, res) => {
  const key = 'all-orders'
  let allOrders = []
  if (nodeCache.has(key)) {
    allOrders = JSON.parse(nodeCache.get(key) as string)
  } else {
    allOrders = await OrderModel.find({}).populate('user', 'name')
    nodeCache.set(key, JSON.stringify(allOrders))
  }

  return customResponse({
    statusCode: 200,
    res,
    data: allOrders,
    message: COMMON_MESSAGES.FETCH_SUCCESSFUL.replace('{{name}}', 'Order')
  })
})

export const getOrderDetails = TryCatch(async (req, res, next) => {
  const { orderId } = req.params
  const orderDetails = await OrderModel.find({ _id: orderId }, { orderItems: 1 })
  if (!orderDetails) return errorResponse({ message: ERROR_MESSAGES.NOT_FOUND.replace('{{name}}', 'Order'), statusCode: 400, next })

  return customResponse({
    statusCode: 200,
    res,
    data: orderDetails,
    message: COMMON_MESSAGES.FETCH_SUCCESSFUL.replace('{{name}}', 'Order')
  })
})

export const processOrder = TryCatch(async (req, res, next) => {
  const { orderId } = req.params
  const order = await OrderModel.findById(orderId)
  if (!order) return errorResponse({ message: ERROR_MESSAGES.NOT_FOUND.replace('{{name}}', 'Order'), statusCode: 404, next })
  switch (order.status) {
    case ESTATUS.PROCESSING:
      order.status = ESTATUS.SHIPPED
      break
    case ESTATUS.SHIPPED:
      order.status = ESTATUS.DELIVERED
      break

    default:
      order.status = ESTATUS.DELIVERED
      break
  }
  await order.save()
  await inValidateCache({ admin: true, orders: true, products: false, userId: order.user })

  return customResponse({
    res,
    message: COMMON_MESSAGES.GENERIC_SUCCESS.replace('{name}', 'Order').replace('{done}', 'Processed')
  })
})
export const deleteOrder = TryCatch(async (req, res, next) => {
  const { orderId } = req.params
  const order = await OrderModel.findById(orderId)
  if (!order) return errorResponse({ message: ERROR_MESSAGES.NOT_FOUND.replace('{{name}}', 'Order'), statusCode: 404, next })
  await order.deleteOne()
  await inValidateCache({ admin: true, orders: true, products: false, userId: order.user })

  return customResponse({
    res,
    message: COMMON_MESSAGES.REMOVED_SUCCESSFUL.replace('{{name}}', 'Order')
  })
})
