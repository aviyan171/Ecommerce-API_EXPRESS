import { NextFunction } from 'express'
import { EnumType } from 'typescript'
import { ResponseType, genericDocument } from '../types/common.js'
import { ErrorHandler } from './utility-class.js'
import { nodeCache } from '../app.js'
import { ProductModel } from '../models/Product.js'
import { Order, OrderItem } from '../types/order.js'
import { ERROR_MESSAGES } from '../constants/errorMessages.js'
import { OrderModel } from '../models/Order.js'
import { today } from '../constants/stats.js'
import { Document } from 'mongoose'

/**
 * Helper function for converting array into object
 */
export const convertObjectToArray = (args: { data: EnumType | Object; extract?: 'keys' | 'values' | 'entries' }) => {
  const { data, extract } = args
  if (extract === 'keys') return Object.keys(data)
  if (extract === 'values') return Object.values(data)
  if (extract === 'entries') return Object.entries(data)
  return Object.keys(data)
}

/**
 * Helper function for creating a response
 */
export const customResponse = <T>({ success = true, statusCode = 200, res, message, data }: ResponseType<T>) => {
  return res.status(statusCode).json({
    success,
    ...(message && { message }),
    ...(data && { data })
  })
}

/**
 * Helper function for throwing a error
 */
export const errorResponse = ({ next, message, statusCode = 400 }: { next: NextFunction; message: string; statusCode?: number }) => {
  return next(new ErrorHandler(message, statusCode))
}

/**
 * Helper function for invalidate cache
 */
export const inValidateCache = async ({
  products,
  admin,
  orders,
  userId
}: {
  products?: boolean
  orders?: boolean
  admin?: boolean
  userId?: string
}) => {
  if (products) {
    const productsKeys: string[] = ['latest-products', 'categories']
    const productId = await ProductModel.find({}).select('_id')
    productId.forEach(i => {
      productsKeys.push(`products - ${i._id}`)
    })
    nodeCache.del(productsKeys)
  }
  if (admin) {
    nodeCache.del(['admin-stats', 'admin-line-charts', 'admin-bar-charts', 'admin-pie-charts'])
  }
  if (orders) {
    const orderKeys: string[] = ['all-orders', `my-orders-${userId}`]
    const orderIds = await OrderModel.find({}).select('_id')
    orderIds.forEach(i => {
      orderKeys.push(`orders-${i._id}`)
    })
    nodeCache.del(orderKeys)
  }
}

export const reduceStock = async (orderItems: OrderItem[]) => {
  for (let index = 0; index < orderItems.length; index++) {
    const order = orderItems[index]
    const product = await ProductModel.findById(order.productId)
    if (!product) throw new ErrorHandler(ERROR_MESSAGES.NOT_FOUND.replace('{{name}}', 'Product'), 400)
    product.stock = product.stock - order.quantity
    await product.save()
  }
}

export const isStockEmpty = async (orderItems: OrderItem[]) => {
  for (let index = 0; index < orderItems.length; index++) {
    const order = orderItems[index]
    const product = await ProductModel.findById(order.productId)
    if (!product) return true
    if (order.quantity > product.stock) return true
    return false
  }
}

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100
  const percent = (thisMonth / lastMonth) * 100
  return percent.toFixed(0)
}

export const getInventories = async (categories: string[], productCount: number) => {
  const categoriesCountPromise = categories.map(category => ProductModel.countDocuments({ category }))
  const categoriesCount = await Promise.all(categoriesCountPromise)

  const categoryPercentage: Record<string, string>[] = []

  categories.forEach((category, i) => {
    categoryPercentage.push({
      [category]: `${Math.round((categoriesCount[i] / productCount) * 100)} %`
    })
  })
  return categoryPercentage
}

export const getChartData = async ({
  length,
  docArr,
  properties
}: {
  length: number
  docArr: genericDocument<{ createdAt: Date; total?: number; discount?: number }>[]
  properties?: 'discount' | 'total'
}) => {
  const data: number[] = new Array(length).fill(0)

  for (const i of docArr) {
    const creationDate = i.createdAt

    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12

    if (monthDiff < length) {
      if (properties) data[length - monthDiff - 1] += i[properties]!
      else {
        data[length - monthDiff - 1] += 1
      }
    }
  }
  return { data }
}
