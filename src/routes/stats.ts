import express from 'express'
import { getDashBoardStats, getPieChartStats } from '../controllers/stats.js'
import { isAdmin } from '../middlewares/auth.js'

const statsRouter = express.Router()

statsRouter.get('/', isAdmin('view dashboard stats'), getDashBoardStats)
statsRouter.get('/pie', isAdmin('view pie'), getPieChartStats)

export { statsRouter }
