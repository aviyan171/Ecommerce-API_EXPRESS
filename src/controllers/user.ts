import { NextFunction, Request, Response } from 'express'
import { UserModel } from '../models/User.js'
import { TNewUserRequestBody } from '../types/user.js'
import { ErrorHandler } from '../utils/utility-class.js'

export const newUser = async (req: Request<{}, {}, TNewUserRequestBody>, res: Response, next: NextFunction) => {
  try {
    const { name, email, photo, gender, _id, dob } = req.body
    if (!name) return next(new ErrorHandler('mero message', 201))
    const user = await UserModel.create({ name, email, photo, gender, _id, dob: new Date(dob) })
    return res.status(200).json({
      success: true,
      message: `Welcome,${user.name}`,
    })
  } catch (error) {
    next(error)
  }
}
