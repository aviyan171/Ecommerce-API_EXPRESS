import { PipelineStage } from 'mongoose'
import { lastMonth, sixMonthAgo, thisMonth } from '../constants/stats.js'

export const thisMonthQuery = [
  {
    $match: { createdAt: { $gte: thisMonth.start, $lte: thisMonth.end } }
  },
  {
    $sort: { createdAt: 1 }
  }
] as PipelineStage[]

export const lastMonthQuery = [
  {
    $match: { createdAt: { $gte: lastMonth.start, $lte: lastMonth.end } }
  },
  {
    $sort: { createdAt: 1 }
  }
] as PipelineStage[]

export const lastSixMonthQuery = [
  {
    $match: { createdAt: { $gte: sixMonthAgo(), $lte: thisMonth.end } }
  },
  {
    $sort: { createdAt: 1 }
  }
] as PipelineStage[]
