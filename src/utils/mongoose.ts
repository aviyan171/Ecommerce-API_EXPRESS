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
