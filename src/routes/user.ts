import express from 'express'
import { getAllUser, getUserById, newUser } from '../controllers/user.js'

const userRouter = express.Router()

userRouter.post('/new', newUser)
userRouter.get('/all', getAllUser)
userRouter.get('/:id', getUserById)

export { userRouter }
