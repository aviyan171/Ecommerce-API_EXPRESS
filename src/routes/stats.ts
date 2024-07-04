import express from 'express'
import { getBarStats, getDashBoardStats, getLineChartStats, getPieChartStats } from '../controllers/stats.js'
import { isAdmin } from '../middlewares/auth.js'

const statsRouter = express.Router()

statsRouter.get('/', isAdmin('view dashboard stats'), getDashBoardStats)
statsRouter.get('/pie', isAdmin('view pie'), getPieChartStats)
statsRouter.get('/bar', isAdmin('view bar'), getBarStats)
statsRouter.get('/line', isAdmin('view bar'), getLineChartStats)

export { statsRouter }
