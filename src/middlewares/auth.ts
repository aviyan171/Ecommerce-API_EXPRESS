import { ERROR_MESSAGES } from '../constants/errorMessages.js'
import { EROLE } from '../enum/user.js'
import { UserModel } from '../models/User.js'
import { errorResponse } from '../utils/common.js'
import { TryCatch } from './error.js'

const { ADMIN_ACCESS, INVALID } = ERROR_MESSAGES

/**
 * Middleware to make sure only admin is allowed
 */
export const isAdmin = (accessType?: string) =>
  TryCatch(async (req, res, next) => {
    const { id } = req.query
    if (!id) return errorResponse({ next, message: INVALID.replace('{{name}}', 'user'), statusCode: 401 })
    const user = await UserModel.findById(id)
    if (!user) return errorResponse({ next, message: INVALID.replace('{{name}}', 'id') })
    if (user.role !== EROLE.ADMIN)
      return errorResponse({ next, message: ADMIN_ACCESS.replace('{{things}}', accessType || ''), statusCode: 401 })
    next()
  })
