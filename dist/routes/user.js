import express from 'express';
import { newUser } from '../controllers/user.js';
const userRouter = express.Router();
userRouter.post('/new', newUser);
export { userRouter };
