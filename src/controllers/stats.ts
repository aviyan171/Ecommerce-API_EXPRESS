import { nodeCache } from '../app.js'
import { today } from '../constants/stats.js'
import { EGender } from '../enum/user.js'
import { TryCatch } from '../middlewares/error.js'
import { OrderModel } from '../models/Order.js'
import { ProductModel } from '../models/Product.js'
import { UserModel } from '../models/User.js'
import { lastMonthQuery, lastSixMonthQuery, thisMonthQuery } from '../queries/stats.js'
import { Order, OrderItem, OrderTRquestBody } from '../types/order.js'
import { calculatePercentage, customResponse } from '../utils/common.js'

export const getDashBoardStats = TryCatch(async (req, res, next) => {
  let stats

  if (nodeCache.has('admin-stats')) stats = JSON.parse(nodeCache.get('admin-stats') as string)
  else {
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

    const thisMonthRevenue = thisMonthOrder.reduce((acc, curr) => acc + (curr?.total || 0), 0)
    const lastMonthRevenue = lastMonthOrder.reduce((acc, curr) => acc + (curr?.total || 0), 0)

    const percent = {
      revenue: `${calculatePercentage(thisMonthRevenue, lastMonthRevenue)} %`,
      user: `${calculatePercentage(thisMonthUser.length, lastMonthUser.length)} %`,
      product: `${calculatePercentage(thisMonthProduct.length, lastMonthProduct.length)} %`,
      order: `${calculatePercentage(thisMonthOrder.length, lastMonthOrder.length)} %`
    }

    const totalRevenue = allOrders.reduce((acc, curr) => acc + (curr?.total || 0), 0)

    const count = {
      revenue: totalRevenue,
      user: userCount,
      product: productCount,
      order: allOrders.length
    }

    const orderMonthCounts = new Array(6).fill(0)
    const orderMonthlyRevenue = new Array(6).fill(0)

    for (const order of lastSixMonthOrder as Order[]) {
      const creationDate = order.createdAt
      const monthDiff = today.getMonth() - creationDate.getMonth()

      if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1
        orderMonthlyRevenue[6 - monthDiff - 1] += order.total
      }
    }

    const categoriesCountPromise = categories.map(category => ProductModel.countDocuments({ category }))
    const categoriesCount = await Promise.all(categoriesCountPromise)

    const categoryPercentage: Record<string, string>[] = []

    categories.forEach((category, i) => {
      categoryPercentage.push({
        [category]: `${Math.round((categoriesCount[i] / productCount) * 100)} %`
      })
    })

    const genderRatio = {
      female: totalFemaleCount,
      male: userCount - totalFemaleCount
    }

    stats = {
      percent,
      latestTransaction,
      count,
      categoryPercentage,
      genderRatio,
      chart: {
        order: orderMonthCounts,
        revenue: orderMonthlyRevenue
      }
    }

    nodeCache.set('admin-stats', JSON.stringify(stats))
  }
  return customResponse({
    res,
    data: stats
  })
})

export const getPieChartStats = TryCatch(async (req, res, next) => {})

export const getBarStats = TryCatch(async (req, res, next) => {})

export const getLineChartStats = TryCatch(async (req, res, next) => {})
