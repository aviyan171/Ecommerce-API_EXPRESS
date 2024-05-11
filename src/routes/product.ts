import express from 'express'
import { addNewProduct, getLatestProduct } from '../controllers/product.js'
import { isAdmin } from '../middlewares/auth.js'
import { singleUpload } from '../middlewares/multer.js'

const productRouter = express.Router()

productRouter.post('/new', isAdmin('create products'), singleUpload, addNewProduct)
productRouter.get('/latest', getLatestProduct)

export { productRouter }
