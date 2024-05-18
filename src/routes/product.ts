import express from 'express'
import {
  addNewProduct,
  deleteProduct,
  getAllCategories,
  getLatestProduct,
  getProductDetails,
  updateProduct,
} from '../controllers/product.js'
import { isAdmin } from '../middlewares/auth.js'
import { multipleUploads } from '../middlewares/multer.js'

const productRouter = express.Router()

productRouter.post('/new', isAdmin('create products'), multipleUploads, addNewProduct)
productRouter.get('/latest', getLatestProduct({ isAdmin: false }))
productRouter.get('/categories', getAllCategories)
productRouter.get('/admin-products', getLatestProduct({ isAdmin: true }))
productRouter.route('/:id').get(getProductDetails).put(multipleUploads, updateProduct).delete(deleteProduct)

export { productRouter }
