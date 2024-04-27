import { EGender, EROLE } from '../enum/user.js'

export type TUser = {
  _id: string
  name: string
  email: string
  photo: string
  role: EROLE
  gender: EGender
  dob: Date
  createdAt: Date
  updatedAt: Date
  //virtual attribute
  age: number
} & Document
