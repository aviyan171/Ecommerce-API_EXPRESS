import { stripe } from '../app.js'
import { COMMON_MESSAGES } from '../constants/commonMessages.js'
import { ERROR_MESSAGES } from '../constants/errorMessages.js'
import { TryCatch } from '../middlewares/error.js'
import { CouponModal } from '../models/Coupons.js'
import { customResponse, errorResponse } from '../utils/common.js'

const { CREATE, FETCH_SUCCESSFUL, REMOVED_SUCCESSFUL } = COMMON_MESSAGES
const { INVALID } = ERROR_MESSAGES

export const createPayment = TryCatch(async (req, res) => {
  const { amount } = req.body

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Number(amount) * 100,
    currency: 'npr'
  })
  return customResponse({
    data: {
      clientSecret: paymentIntent.client_secret
    },
    statusCode: 201,
    res
  })
})
export const createCoupon = TryCatch(async (req, res) => {
  const { code, amount } = req.body
  await CouponModal.create({ code, amount })
  return customResponse({
    message: CREATE.replace('{{name}}', `Coupon ${code}`),
    statusCode: 201,
    res
  })
})

export const applyDiscount = TryCatch(async (req, res, next) => {
  const { code } = req.query
  const discount = await CouponModal.findOne({ code })
  if (!discount) errorResponse({ next, message: INVALID.replace('{{name}}', 'Coupon') })
  return customResponse({
    res,
    data: {
      discount: discount?.amount
    }
  })
})

export const getAllCoupons = TryCatch(async (req, res, next) => {
  const coupons = await CouponModal.find({})
  return customResponse({
    message: FETCH_SUCCESSFUL.replace('{{name}}', 'Coupons'),
    res,
    data: coupons
  })
})

export const deleteCoupon = TryCatch(async (req, res, next) => {
  const { id } = req.params
  await CouponModal.deleteOne({ _id: id })
  return customResponse({
    message: REMOVED_SUCCESSFUL.replace('{{name}}', 'Coupons'),
    res,
    data: { _id: id }
  })
})
