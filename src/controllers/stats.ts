import { nodeCache } from '../app.js'
import { lastMonth, thisMonth } from '../constants/stats.js'
import { TryCatch } from '../middlewares/error.js'
import { OrderModel } from '../models/Order.js'
import { ProductModel } from '../models/Product.js'
import { UserModel } from '../models/User.js'
import { lastMonthQuery, thisMonthQuery } from '../queries/stats.js'
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

    const [
      thisMonthProduct,
      lastMonthProduct,
      thisMonthUser,
      lastMonthUser,
      thisMonthOrder,
      lastMonthOrder,
      productCount,
      userCount,
      allOrders
    ] = await Promise.all([
      thisMonthProductPromise,
      lastMonthProductPromise,
      thisMonthUserPromise,
      lastMonthUserPromise,
      thisMonthOrderPromise,
      lastMonthOrderPromise,
      productCountPromise,
      userCountPromise,
      allOrderPromise
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

    stats = { percent, count }
  }
  return customResponse({
    res,
    data: stats
  })
})

export const getPieChartStats = TryCatch(async (req, res, next) => {})

export const getBarStats = TryCatch(async (req, res, next) => {})

export const getLineChartStats = TryCatch(async (req, res, next) => {})
