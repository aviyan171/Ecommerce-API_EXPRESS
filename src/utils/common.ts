import { NextFunction } from 'express'
import { EnumType } from 'typescript'
import { ResponseType } from '../types/common.js'
import { ErrorHandler } from './utility-class.js'
import { nodeCache } from '../app.js'
import { ProductModel } from '../models/Product.js'

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
    message,
    ...(data && { data }),
  })
}

/**
 * Helper function for throwing a error
 */
export const errorResponse = ({
  next,
  message,
  statusCode = 400,
}: {
  next: NextFunction
  message: string
  statusCode?: number
}) => {
  return next(new ErrorHandler(message, statusCode))
}

export const inValidateCache = async ({
  products,
  admin,
  orders,
}: {
  products?: boolean
  orders?: boolean
  admin?: boolean
}) => {
  if (products) {
    const productsKeys: string[] = ['latest-products', 'categories']
    const productId = await ProductModel.find({}).select('_id')
    productId.forEach((i) => {
      productsKeys.push(`products - ${i._id}`)
    })
    nodeCache.del(productsKeys)
  }
  if (admin) {
  }
  if (orders) {
  }
}
