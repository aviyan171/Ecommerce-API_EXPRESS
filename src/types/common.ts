import { NextFunction, Request, Response } from 'express'
import { Document, Types } from 'mongoose'

export type ControllerType = (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>

export type ResponseType<T> = {
  res: Response
  statusCode?: number
  success?: boolean
  message?: string
  data?: T
}

export type genericDocument<T> = Document<unknown, {}, T> &
  T & {
    _id: Types.ObjectId
  }
