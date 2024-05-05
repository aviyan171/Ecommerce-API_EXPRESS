import express from 'express'
import { deleteUser, getAllUser, getUserById, newUser } from '../controllers/user.js'

const userRouter = express.Router()

userRouter.post('/new', newUser)
userRouter.get('/all', getAllUser)
userRouter.route('/:id').get(getUserById).delete(deleteUser)

export { userRouter }
