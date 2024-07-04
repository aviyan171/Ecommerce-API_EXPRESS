import { ESTATUS } from '../enum/order.js'
import { EGender, EROLE } from '../enum/user.js'
import { OrderModel } from '../models/Order.js'
import { ProductModel } from '../models/Product.js'
import { UserModel } from '../models/User.js'
import { lastMonthQuery, lastSixMonthQuery, lastTwelveMonthQuery, thisMonthQuery } from '../queries/stats.js'
import { Order } from '../types/order.js'
import { TUser } from '../types/user.js'

/**
 * Created a separate utility function to get necessary the data from database for dashboard stats
 * Since it has became lengthy, i have created separate utils for better readability
 */
export const getAllDashboardStatsPromises = async (): Promise<any> => {
  const thisMonthProductPromise = ProductModel.aggregate(thisMonthQuery)
  const lastMonthProductPromise = ProductModel.aggregate(lastMonthQuery)
  const thisMonthUserPromise = UserModel.aggregate(thisMonthQuery)
  const lastMonthUserPromise = UserModel.aggregate(lastMonthQuery)
  const thisMonthOrderPromise = OrderModel.aggregate(thisMonthQuery)
  const lastMonthOrderPromise = OrderModel.aggregate(lastMonthQuery)
  const productCountPromise = ProductModel.countDocuments()
  const userCountPromise = UserModel.countDocuments()
  const allOrderPromise = OrderModel.find({}).select('total')
  const lastSixMonthOrderPromise = OrderModel.aggregate(lastSixMonthQuery)
  const allCategoryPromise = ProductModel.distinct('category')
  const totalFemalePromise = UserModel.countDocuments({ gender: EGender.FEMALE })
  const latestTransactionPromise = OrderModel.find({}).select(['orderItems', 'discount', 'total', 'status']).limit(4)

  const [
    thisMonthProduct,
    lastMonthProduct,
    thisMonthUser,
    lastMonthUser,
    thisMonthOrder,
    lastMonthOrder,
    productCount,
    userCount,
    allOrders,
    lastSixMonthOrder,
    categories,
    totalFemaleCount,
    latestTransaction
  ] = await Promise.all([
    thisMonthProductPromise,
    lastMonthProductPromise,
    thisMonthUserPromise,
    lastMonthUserPromise,
    thisMonthOrderPromise,
    lastMonthOrderPromise,
    productCountPromise,
    userCountPromise,
    allOrderPromise,
    lastSixMonthOrderPromise,
    allCategoryPromise,
    totalFemalePromise,
    latestTransactionPromise
  ])

  return [
    thisMonthProduct,
    lastMonthProduct,
    thisMonthUser,
    lastMonthUser,
    thisMonthOrder,
    lastMonthOrder,
    productCount,
    userCount,
    allOrders,
    lastSixMonthOrder,
    categories,
    totalFemaleCount,
    latestTransaction
  ]
}

/**
 * Created a separate utility function to get necessary the data from database for pie charts stats
 * Since it has became lengthy, i have created separate utils for better readability
 */
export const getAllPieChartStatsPromises = async (): Promise<any> => {
  const [
    processingOrder,
    shippedOrder,
    deliveredOrder,
    categories,
    productCount,
    productOutOfStock,
    allOrders,
    allUsers,
    adminUsers,
    customerUsers
  ] = await Promise.all([
    OrderModel.countDocuments({ status: ESTATUS.PROCESSING }),
    OrderModel.countDocuments({ status: ESTATUS.SHIPPED }),
    OrderModel.countDocuments({ status: ESTATUS.DELIVERED }),
    ProductModel.distinct('category'),
    ProductModel.countDocuments(),
    ProductModel.countDocuments({ stock: 0 }),
    OrderModel.find({}).select(['total', 'discount', 'subtotal', 'tax', 'shippingCharges']),
    UserModel.find({}).select(['dob']),
    UserModel.countDocuments({ role: EROLE.ADMIN }),
    UserModel.countDocuments({ role: EROLE.USER })
  ])

  return [
    processingOrder,
    shippedOrder,
    deliveredOrder,
    categories,
    productCount,
    productOutOfStock,
    allOrders,
    allUsers,
    adminUsers,
    customerUsers
  ]
}

/**
 * Created a separate utility function to get necessary data from database for Bar charts stats
 * Since it has became lengthy, i have created separate utils for better readability
 */
export const getallBarChartsPromises = async (): Promise<any> => {
  const lastSixMonthProductPromise = ProductModel.aggregate(lastSixMonthQuery)
  const lastSixMonthUserPromise = UserModel.aggregate(lastSixMonthQuery)
  const lastTwelveMonthOrderPromise = OrderModel.aggregate(lastTwelveMonthQuery)

  const [products, users, orders] = await Promise.all([lastSixMonthProductPromise, lastSixMonthUserPromise, lastTwelveMonthOrderPromise])

  return [products, users, orders]
}

/**
 * Created a separate utility function to get necessary data from database for line charts stats
 * Since it has became lengthy, i have created separate utils for better readability
 */
export const getallLineChartsPromises = async (): Promise<any> => {
  const lastTwelveMonthOrderPromise = OrderModel.aggregate(lastTwelveMonthQuery)
  const lastTwelveMonthUserPromise = UserModel.aggregate(lastTwelveMonthQuery)
  const lastTwelveMonthProductPromise = ProductModel.aggregate(lastTwelveMonthQuery)

  const [products, users, orders] = await Promise.all([
    lastTwelveMonthProductPromise,
    lastTwelveMonthUserPromise,
    lastTwelveMonthOrderPromise
  ])

  return [products, users, orders]
}

export const getRevenueDistribution = (allOrders: Order[]) => {
  const grossIncome = allOrders.reduce((accumulator, currentValue) => accumulator + (currentValue?.total || 0), 0)
  const discount = allOrders.reduce((accumulator, currentValue) => accumulator + (currentValue?.discount || 0), 0)
  const productionCost = allOrders.reduce((accumulator, currentValue) => accumulator + (currentValue?.shippingCharges || 0), 0)
  const burnt = allOrders.reduce((accumulator, currentValue) => accumulator + (currentValue?.tax || 0), 0)
  const marketingCost = Math.round(grossIncome * (30 / 100))
  const netMargin = grossIncome - discount - productionCost - burnt - marketingCost

  const revenueDistribution = {
    grossIncome,
    discount,
    productionCost,
    burnt,
    marketingCost,
    netMargin
  }

  return revenueDistribution
}

export const getUserAgeGroup = (allUsers: TUser[]) => {
  const teen = allUsers.filter(i => i.age <= 20).length
  const adult = allUsers.filter(i => i.age > 20 && i.age <= 40).length
  const old = allUsers.filter(i => i.age > 40).length
  return {
    teen,
    adult,
    old
  }
}
