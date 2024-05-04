import { NextFunction, Request, Response } from 'express'

export type ControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>

export type ResponseType<T> = {
  res: Response
  statusCode?: number
  success?: boolean
  message: string
  data?: T
}
