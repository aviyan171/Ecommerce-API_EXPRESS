import mongoose from 'mongoose'
import { createModel } from '../utils/mongoose.js'
import { ESTATUS } from '../enum/order.js'
import { OrderTRquestBody } from '../types/order.js'

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      country: {
        type: String,
        required: true
      },
      pinCode: {
        type: Number,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phoneNo: {
        type: Number,
        required: true
      }
    },
    user: {
      type: String,
      ref: 'User',
      required: true
    },
    subtotal: {
      type: Number,
      required: true
    },
    tax: {
      type: Number,
      required: true
    },
    shippingCharges: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: [ESTATUS.DELIVERED, ESTATUS.PROCESSING, ESTATUS.SHIPPED],
      default: ESTATUS.PROCESSING
    },
    orderItems: [
      {
        name: String,
        photo: String,
        price: Number,
        quantity: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: 'Product'
        }
      }
    ]
  },
  { timestamps: true }
)

export const OrderModel = createModel<OrderTRquestBody>({ modelName: 'Order', schema: orderSchema })
