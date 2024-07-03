import { ESTATUS } from '../enum/order.js'

export type OrderItem = {
  name: string
  photo: string
  price: number
  quantity: number
  productId: string
}
export type ShippingInfo = {
  address: string
  city: string
  state: string
  country: string
  pinCode: number
}

export type OrderTRquestBody = {
  shippingInfo: ShippingInfo
  user: string
  subtotal: number
  tax: number
  shippingCharges: number
  discount: number
  total: number
  orderItems: OrderItem[]
  status?: ESTATUS
}

export type Order = OrderTRquestBody & {
  createdAt: Date
  updatedAt: Date
}
