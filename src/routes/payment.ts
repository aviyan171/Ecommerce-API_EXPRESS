import express from 'express'
import { isAdmin } from '../middlewares/auth.js'
import { applyDiscount, createCoupon, createPayment, deleteCoupon, getAllCoupons } from '../controllers/payment.js'

const paymentRouter = express.Router()

paymentRouter.post('/coupon/new', isAdmin('create coupon'), createCoupon)
paymentRouter.post('/create', createPayment)
paymentRouter.get('/apply-discount', applyDiscount)
paymentRouter.get('/coupons', isAdmin('view all coupons'), getAllCoupons)
paymentRouter.delete('/coupon/:id', isAdmin('delete coupons'), deleteCoupon)

export { paymentRouter }
