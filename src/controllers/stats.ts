import { nodeCache } from '../app.js'
import { TryCatch } from '../middlewares/error.js'

import { Order } from '../types/order.js'
import { TUser } from '../types/user.js'
import { calculatePercentage, customResponse, getChartData, getInventories } from '../utils/common.js'
import {
  getAllDashboardStatsPromises,
  getAllPieChartStatsPromises,
  getRevenueDistribution,
  getUserAgeGroup,
  getallBarChartsPromises,
  getallLineChartsPromises
} from '../utils/stats.js'

export const getDashBoardStats = TryCatch(async (req, res, next) => {
  let stats

  if (nodeCache.has('admin-stats')) stats = JSON.parse(nodeCache.get('admin-stats') as string)
  else {
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
    ] = await getAllDashboardStatsPromises()

    const thisMonthRevenue = (thisMonthOrder as Order[]).reduce((acc, curr) => acc + (curr?.total || 0), 0)
    const lastMonthRevenue = (lastMonthOrder as Order[]).reduce((acc, curr) => acc + (curr?.total || 0), 0)

    const percent = {
      revenue: `${calculatePercentage(thisMonthRevenue, lastMonthRevenue)} %`,
      user: `${calculatePercentage(thisMonthUser.length, lastMonthUser.length)} %`,
      product: `${calculatePercentage(thisMonthProduct.length, lastMonthProduct.length)} %`,
      order: `${calculatePercentage(thisMonthOrder.length, lastMonthOrder.length)} %`
    }

    const totalRevenue = (allOrders as Order[]).reduce((acc, curr) => acc + (curr?.total || 0), 0)

    const count = {
      revenue: totalRevenue,
      user: userCount,
      product: productCount,
      order: allOrders.length
    }

    const orderMonthCounts = (await getChartData({ length: 6, docArr: lastSixMonthOrder })).data
    const orderMonthlyRevenue = (await getChartData({ length: 6, docArr: lastSixMonthOrder, properties: 'total' })).data

    const categoryPercentage = await getInventories(categories, productCount)

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

export const getPieChartStats = TryCatch(async (req, res, next) => {
  let charts

  if (nodeCache.has('admin-pie-charts')) charts = JSON.parse(nodeCache.get('admin-pie-charts') as string)
  else {
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
    ] = await getAllPieChartStatsPromises()

    const productCategoriesRatio = await getInventories(categories, productCount)

    const revenueDistribution = getRevenueDistribution(allOrders as Order[])

    const userAgeGroup = getUserAgeGroup(allUsers as TUser[])

    const orderFulFillment = {
      processing: processingOrder,
      shipped: shippedOrder,
      delivered: deliveredOrder
    }

    const stockAvailability = {
      inStock: productCount - productOutOfStock,
      outOfStock: productOutOfStock
    }

    const users = {
      admin: adminUsers,
      customer: customerUsers
    }

    charts = {
      orderFulFillment,
      productCategoriesRatio,
      stockAvailability,
      revenueDistribution,
      users,
      userAgeGroup
    }

    nodeCache.set('admin-pie-charts', JSON.stringify(charts))
  }
  return customResponse({
    res,
    data: charts
  })
})

export const getBarStats = TryCatch(async (req, res, next) => {
  let charts

  const key = 'admin-bar-charts'

  if (nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string)
  else {
    const [products, users, orders] = await getallBarChartsPromises()

    const productCounts = await getChartData({ length: 6, docArr: products })
    const userCounts = await getChartData({ length: 6, docArr: users })
    const orderCounts = await getChartData({ length: 12, docArr: orders })

    charts = {
      users: userCounts.data,
      products: productCounts.data,
      orders: orderCounts.data
    }
    nodeCache.set(key, JSON.stringify(charts))
  }

  return customResponse({
    res,
    data: charts
  })
})

export const getLineChartStats = TryCatch(async (req, res, next) => {
  let charts

  const key = 'admin-line-charts'

  if (nodeCache.has(key)) charts = JSON.parse(nodeCache.get(key) as string)
  else {
    const [products, users, orders] = await getallLineChartsPromises()

    const productCounts = await getChartData({ length: 12, docArr: products })
    const userCounts = await getChartData({ length: 12, docArr: users })
    const discount = (await getChartData({ length: 12, docArr: orders, properties: 'discount' })).data
    const revenue = (await getChartData({ length: 12, docArr: orders, properties: 'total' })).data

    charts = {
      users: userCounts.data,
      products: productCounts.data,
      discount,
      revenue
    }
    nodeCache.set(key, JSON.stringify(charts))
  }

  return customResponse({
    res,
    data: charts
  })
})
