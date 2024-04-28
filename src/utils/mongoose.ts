import mongoose, { Model, Schema } from 'mongoose'

export const createModel = <T extends Document>({
  modelName,
  schema,
}: {
  modelName: string
  schema: Schema<T>
}): Model<T> => {
  // Create and return the model using the given model name and schema
  return mongoose.model<T>(modelName, schema)
}
export const connectDB = async () => {
  try {
    const res = await mongoose.connect('mongodb://localhost:27017', {
      dbName: 'Ecommerce_DB',
    })
    console.log(`DB Connected to ${res.connection.host} successfully`)
  } catch (error) {
    console.log(error)
  }
}
