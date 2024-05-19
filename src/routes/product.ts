import express from 'express'
import {
  addNewProduct,
  deleteProduct,
  getAllCategories,
  getLatestProduct,
  getProductDetails,
  searchProducts,
  updateProduct,
} from '../controllers/product.js'
import { isAdmin } from '../middlewares/auth.js'
import { multipleUploads } from '../middlewares/multer.js'

const productRouter = express.Router()

productRouter.post('/new', isAdmin('create products'), multipleUploads, addNewProduct)
productRouter.get('/latest', getLatestProduct({ isAdmin: false }))
productRouter.get('/categories', getAllCategories)
productRouter.get('/admin-products', getLatestProduct({ isAdmin: true }))
productRouter.get('/search', searchProducts)

//always put this chain routes at last
productRouter
  .route('/:id')
  .get(getProductDetails)
  .put(isAdmin('update product'), multipleUploads, updateProduct)
  .delete(isAdmin('delete product'), deleteProduct)

export { productRouter }
