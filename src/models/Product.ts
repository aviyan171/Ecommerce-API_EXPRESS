import mongoose from 'mongoose'
import { VALIDATION_MESSAGES } from '../constants/validatonMessages.js'
import { Product } from '../types/poduct.js'
import { createModel } from '../utils/mongoose.js'

const { ADD_NAME, ADD_PHOTO, ADD_STOCK, ADD_PRICE, ADD_CATEGORY } = VALIDATION_MESSAGES

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, ADD_NAME]
    },
    photo: {
      type: Array,
      required: [true, ADD_PHOTO]
    },
    price: {
      type: Number,
      required: [true, ADD_PRICE]
    },
    stock: {
      type: Number,
      required: [true, ADD_STOCK]
    },
    category: {
      type: String,
      required: [true, ADD_CATEGORY],
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, ADD_CATEGORY]
    }
  },
  { timestamps: true }
)

export const ProductModel = createModel<Product>({ modelName: 'Product', schema: productSchema })
