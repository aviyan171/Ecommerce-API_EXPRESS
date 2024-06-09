import { NextFunction, Request, Response } from 'express'
import { ERROR_MESSAGES } from '../constants/errorMessages.js'
import { ControllerType } from '../types/common.js'
import { customResponse } from '../utils/common.js'
import { ErrorHandler } from '../utils/utility-class.js'

export const errorMiddleWare = (err: ErrorHandler, req: Request, res: Response, _next: NextFunction) => {
  err.message ||= ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  err.statusCode ||= 500
  if (err.name === 'CastError') err.message = ERROR_MESSAGES.INVALID.replace('{{name}}', 'Id')
  return customResponse({ res, message: err.message, statusCode: err.statusCode, success: false })
}

export const TryCatch = (func: ControllerType) => {
  return (req: Request, res: Response, next: NextFunction) => Promise.resolve(func(req, res, next)).catch(next)
}
