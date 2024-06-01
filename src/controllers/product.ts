import { Request } from 'express'
import { rm } from 'fs'
import { COMMON_MESSAGES } from '../constants/commonMessages.js'
import { ERROR_MESSAGES } from '../constants/errorMessages.js'
import { VALIDATION_MESSAGES } from '../constants/validatonMessages.js'
import { TryCatch } from '../middlewares/error.js'
import { ProductModel } from '../models/Product.js'
import { ControllerType, genericDocument } from '../types/common.js'
import { Product, ProductBaseQuery, ProductRequestBody, ProductSearchQuery } from '../types/poduct.js'
import { customResponse, errorResponse, inValidateCache } from '../utils/common.js'
import { nodeCache } from '../app.js'

const { CREATE, FETCH_SUCCESSFUL, REMOVED_SUCCESSFUL, UPDATE_SUCCESSFUL } = COMMON_MESSAGES
const { ADD_PHOTO, ADD_ALL_FIELDS } = VALIDATION_MESSAGES
const { INVALID, NOT_FOUND } = ERROR_MESSAGES

export const addNewProduct: ControllerType = TryCatch(async (req: Request<{}, {}, ProductRequestBody>, res, next) => {
  const { name, price, stock, category } = req.body
  const photos = req.files as Express.Multer.File[]
  if (!photos?.length) return errorResponse({ next, message: ADD_PHOTO })

  if (!name || !price || !stock || !category) {
    photos.forEach((i) => {
      rm(i.path, () => console.log(REMOVED_SUCCESSFUL.replace('{{name}}', 'Photos')))
    })
    return errorResponse({ next, message: ADD_ALL_FIELDS })
  }

  const data = {
    name,
    price,
    stock,
    category: category.toLowerCase(),
    photo: photos.map((i) => i.path),
  }
  const newProducts = await ProductModel.create(data)

  await inValidateCache({ products: true })

  return customResponse<ProductRequestBody>({
    statusCode: 201,
    message: CREATE.replace('{{name}}', 'Product'),
    res,
    data: newProducts,
  })
})

export const getLatestProduct = ({ isAdmin }: { isAdmin: boolean }): ControllerType =>
  TryCatch(async (req: Request<{}, {}, ProductRequestBody>, res) => {
    let products

    if (nodeCache.has('latest-products')) {
      products = JSON.parse(nodeCache.get('latest-products') as string)
    } else {
      if (!isAdmin) products = await ProductModel.find({}).sort({ createdAt: -1 }).limit(5)
      if (isAdmin) products = await ProductModel.find({})
      nodeCache.set('latest-products', JSON.stringify(products))
    }

    return customResponse({
      statusCode: 200,
      message: FETCH_SUCCESSFUL.replace('{{name}}', 'Latest product'),
      res,
      data: products,
    })
  })

export const getAllCategories: ControllerType = TryCatch(async (_req, res) => {
  let categories
  if (nodeCache.has('categories')) {
    categories = JSON.parse(nodeCache.get('categories') as string)
  } else {
    categories = await ProductModel.distinct('category')
    nodeCache.set('categories', JSON.stringify(categories))
  }

  return customResponse({
    res,
    data: categories,
    message: FETCH_SUCCESSFUL.replace('{{name}}', 'Categories'),
  })
})

export const getProductDetails: ControllerType = TryCatch(async (req, res, next) => {
  const { id } = req.params
  let productDetails

  if (nodeCache.has(`products-${id}`)) {
    productDetails = JSON.parse(nodeCache.get(`products-${id}`) as string)
  } else {
    productDetails = await ProductModel.findById(id)
    if (!productDetails) return errorResponse({ next, message: NOT_FOUND.replace('{{name}}', 'Product') })
    nodeCache.set(`products-${id}`, JSON.stringify(productDetails))
  }

  return customResponse({
    message: FETCH_SUCCESSFUL.replace('{{name}}', 'Products'),
    res,
    data: productDetails,
  })
})

export const updateProduct: ControllerType = TryCatch(async (req, res, next) => {
  const { id } = req.params

  const { name, price, stock, category } = req.body
  const updatedFields: Partial<genericDocument<Product>> = { name, price, stock, category }
  const photos = req.files as Express.Multer.File[]
  const product = await ProductModel.findById(id)
  if (!product) return errorResponse({ next, message: INVALID.replace('{{name}}', 'Id') })

  if (photos?.length) {
    product.photo.forEach((i) => {
      rm(i, () => console.log(REMOVED_SUCCESSFUL.replace('{{name}}', 'Old Photos')))
    })
    product!.photo = photos.map((p) => p.path)
  }
  ;(Object.keys(updatedFields) as (keyof Product)[]).forEach((key) => {
    const value = updatedFields[key]
    if (value) {
      ;(product as any)[key] = value
    }
  })
  await product.save()

  await inValidateCache({ products: true })

  return customResponse<ProductRequestBody>({
    statusCode: 200,
    message: UPDATE_SUCCESSFUL.replace('{{name}}', 'Product'),
    res,
    data: product,
  })
})

export const deleteProduct = TryCatch(async (req, res, next) => {
  const product = await ProductModel.findById(req.params.id)
  if (!product) return errorResponse({ next, message: NOT_FOUND.replace('{{name}}', 'Product') })
  product.photo.forEach((i) => {
    rm(i, () => console.log(REMOVED_SUCCESSFUL.replace('{{name}}', 'Old Photos')))
  })
  await ProductModel.deleteOne()

  await inValidateCache({ products: true })

  return customResponse({
    statusCode: 200,
    message: REMOVED_SUCCESSFUL.replace('{{name}}', 'Product'),
    res,
    data: { id: product.id },
  })
})

export const searchProducts = TryCatch(async (req: Request<{}, {}, {}, ProductSearchQuery>, res, next) => {
  const { category, keyword, price, sort } = req.query
  const page = Number(req.query.page) || 1
  const limit = 8
  const skip = limit * (page - 1)
  const baseQuery: ProductBaseQuery = {}
  if (keyword) {
    baseQuery.name = {
      $regex: keyword,
      $options: 'i',
    }
  }
  if (price) {
    baseQuery.price = {
      $lte: Number(price),
    }
  }
  if (category) baseQuery.category = category

  const [products, filteredOnlyProduct] = await Promise.all([
    ProductModel.find(baseQuery)
      .sort(sort ? { price: sort === 'asc' ? 1 : -1 } : undefined)
      .limit(limit)
      .skip(skip),
    ProductModel.find(baseQuery),
  ])
  const totalPage = Math.ceil(filteredOnlyProduct.length / limit)
  return customResponse({
    res,
    message: FETCH_SUCCESSFUL.replace('{{name}}', 'Products'),
    data: {
      totalPage,
      rows: products,
    },
  })
})
