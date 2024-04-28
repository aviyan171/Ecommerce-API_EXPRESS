import express from 'express'
import { errorMiddleWare } from './middlewares/error.js'
import { userRouter } from './routes/user.js'
import { connectDB } from './utils/mongoose.js'

const port = 4000

const app = express()

//middleware
app.use(express.json()) //used for accessing json data

//connect DB
connectDB()

//using Routes
app.use('/api/v1/user', userRouter)

//error middleware
app.use(errorMiddleWare)

app.listen(port, () => {
  console.log(`Server is working on ${port}`)
})
