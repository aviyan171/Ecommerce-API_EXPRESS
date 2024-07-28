import express from 'express'
import { deleteUser, getAllUser, getUserById, newUser } from '../controllers/user.js'
import { isAdmin } from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/new', newUser)
userRouter.get('/all', isAdmin('get all user'), getAllUser)
userRouter.route('/:id').get(getUserById).delete(isAdmin('delete user'), deleteUser)

export { userRouter }
