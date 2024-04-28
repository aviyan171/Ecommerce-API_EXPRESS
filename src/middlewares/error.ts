import { NextFunction, Request, Response } from 'express'
import { ERROR_MESSAGES } from '../constants/errorMessages.js'
import { ErrorHandler } from '../utils/utility-class.js'

export const errorMiddleWare = (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
  err.message ||= ERROR_MESSAGES.INTERNAL_SERVER_ERROR
  err.statusCode ||= 500
  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  })
}
