import { Request } from 'express'
import { COMMON_MESSAGES } from '../constants/commonMessages.js'
import { ERROR_MESSAGES } from '../constants/errorMessages.js'
import { VALIDATION_MESSAGES } from '../constants/validatonMessages.js'
import { TryCatch } from '../middlewares/error.js'
import { UserModel } from '../models/User.js'
import { ControllerType } from '../types/common.js'
import { TNewUserRequestBody } from '../types/user.js'
import { customResponse } from '../utils/common.js'
import { ErrorHandler } from '../utils/utility-class.js'

const { WELCOME, FETCH_SUCCESSFUL, REMOVED_SUCCESSFUL } = COMMON_MESSAGES
const { ADD_ALL_FIELDS, ADD_ID } = VALIDATION_MESSAGES
const { INVALID } = ERROR_MESSAGES

export const newUser: ControllerType = TryCatch(async (req: Request<{}, {}, TNewUserRequestBody>, res, _next) => {
  const { name, email, photo, gender, _id, dob } = req.body
  let user = await UserModel.findById(_id)
  if (user) return customResponse({ res, message: WELCOME.replace('{{name}}', user.name) })
  if (!_id || !email || !photo || !gender || !dob) throw new ErrorHandler(ADD_ALL_FIELDS, 400)
  user = await UserModel.create({ name, email, photo, gender, _id, dob: new Date(dob) })
  return customResponse({ res, message: WELCOME.replace('{{name}}', user.name) })
})

export const getAllUser: ControllerType = TryCatch(async (req, res, next) => {
  const users = await UserModel.find({})
  return customResponse({ res, message: FETCH_SUCCESSFUL.replace('{{name}}', 'Users'), data: users, success: true })
})

export const getUserById: ControllerType = TryCatch(async (req, res, next) => {
  const { id } = req.params
  const user = await UserModel.findById(id)
  if (!user) throw new ErrorHandler(INVALID.replace('{{name}}', 'id'), 400)
  return customResponse({ res, message: FETCH_SUCCESSFUL.replace('{{name}}', 'User'), data: user })
})

export const deleteUser: ControllerType = TryCatch(async (req, res, next) => {
  const { id } = req.params
  const user = await UserModel.findById(id)
  if (!user) throw new ErrorHandler(INVALID.replace('{{name}}', 'id'), 400)
  await user.deleteOne()
  return customResponse({ res, message: REMOVED_SUCCESSFUL.replace('{{name}}', 'User'), data: { id: user._id } })
})
