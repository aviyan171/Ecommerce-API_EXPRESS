import express from 'express'
import { errorMiddleWare } from './middlewares/error.js'
import { productRouter } from './routes/product.js'
import { userRouter } from './routes/user.js'
import { connectDB } from './utils/mongoose.js'
import NodeCache from 'node-cache'
import { orderRouter } from './routes/orders.js'
import { config } from 'dotenv'
import morgan from 'morgan'
import { paymentRouter } from './routes/payment.js'

config({
  path: './.env'
})

const port = process.env.PORT
const mongoUri = process.env.MONGO_URI as string

const app = express()

//middleware
app.use(express.json()) //used for accessing json data
app.use(morgan('dev'))

//connect DB
connectDB(mongoUri)

//node-cache
export const nodeCache = new NodeCache()

//using Routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)
app.use('/api/v1/order', orderRouter)
app.use('/api/v1/payment', paymentRouter)

//static
app.use('/uploads', express.static('uploads'))

//error middleware
app.use(errorMiddleWare)

app.listen(port, () => {
  console.log(`Server is working on ${port}`)
})
