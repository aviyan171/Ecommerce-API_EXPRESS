import express from 'express'
import { errorMiddleWare } from './middlewares/error.js'
import { productRouter } from './routes/product.js'
import { userRouter } from './routes/user.js'
import { connectDB } from './utils/mongoose.js'
import NodeCache from 'node-cache'

const port = 4000

const app = express()

//middleware
app.use(express.json()) //used for accessing json data

//connect DB
connectDB()

//node-cache
export const nodeCache = new NodeCache()

//using Routes
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)

//static
app.use('/uploads', express.static('uploads'))

//error middleware
app.use(errorMiddleWare)

app.listen(port, () => {
  console.log(`Server is working on ${port}`)
})
