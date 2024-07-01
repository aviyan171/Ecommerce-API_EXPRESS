import mongoose from 'mongoose'
import { VALIDATION_MESSAGES } from '../constants/validatonMessages.js'
import { createModel } from '../utils/mongoose.js'
import { Coupon } from '../types/payment.js'

const couponsSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, VALIDATION_MESSAGES.ENTER_COUPON],
    unique: true
  },
  amount: {
    type: Number,
    required: [true, VALIDATION_MESSAGES.ENTER_COUPON]
  }
})

export const CouponModal = createModel<Coupon>({ modelName: 'Coupon', schema: couponsSchema })
