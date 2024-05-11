import { Request } from 'express'
import { rm } from 'fs'
import { COMMON_MESSAGES } from '../constants/commonMessages.js'
import { VALIDATION_MESSAGES } from '../constants/validatonMessages.js'
import { TryCatch } from '../middlewares/error.js'
import { ProductModel } from '../models/Product.js'
import { ControllerType } from '../types/common.js'
import { ProductRequestBody } from '../types/poduct.js'
import { customResponse, errorResponse } from '../utils/common.js'

const { CREATE, FETCH_SUCCESSFUL } = COMMON_MESSAGES
const { ADD_PHOTO, ADD_ALL_FIELDS } = VALIDATION_MESSAGES

export const addNewProduct: ControllerType = TryCatch(async (req: Request<{}, {}, ProductRequestBody>, res, next) => {
  const { name, price, stock, category } = req.body
  const photos = req.files as Express.Multer.File[]
  if (!photos?.length) return errorResponse({ next, message: ADD_PHOTO })

  if (!name || !price || !stock || !category) {
    photos.forEach((i) => {
      rm(i.path, () => console.log('Photo Deleted Successfully'))
    })
    return errorResponse({ next, message: ADD_ALL_FIELDS })
  }

  const data = {
    name,
    price,
    stock,
    category: category.toLowerCase(),
    photo: photos.map((i) => i.filename),
  }
  await ProductModel.create(data)
  return customResponse<ProductRequestBody>({
    statusCode: 201,
    message: CREATE.replace('{{name}}', 'Product'),
    res,
    data,
  })
})

export const getLatestProduct: ControllerType = TryCatch(
  async (req: Request<{}, {}, ProductRequestBody>, res, next) => {
    const products = await ProductModel.find({}).sort({ createdAt: -1 }).limit(5)

    return customResponse({
      statusCode: 200,
      message: FETCH_SUCCESSFUL.replace('{{name}}', 'Latest product'),
      res,
      data: products,
    })
  }
)
