import express from 'express'
import { getDashBoardStats } from '../controllers/stats.js'
import { isAdmin } from '../middlewares/auth.js'

const statsRouter = express.Router()

statsRouter.get('/', isAdmin('view dashboard stats'), getDashBoardStats)

export { statsRouter }
