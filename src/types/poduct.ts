import { TNewUserRequestBody } from './user.js'

export type Product = {
  createdAt: Date
  updatedAt: Date
  name: string
  photo: string[]
  price: number
  stock: number
  category: string
}
export type ProductRequestBody = Omit<TNewUserRequestBody, 'dob' | 'gender' | 'email' | '_id' | 'photo'> & {
  stock: number
  category: string
  price: number
}

export type ProductSearchQuery = {
  keyword?: string
  price?: string
  category?: string
  sort?: string
  page?: string
}

export type ProductBaseQuery = {
  name?: {
    $regex: string
    $options: string
  }
  price?: { $lte: number }
  category?: string
}
