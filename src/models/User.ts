import mongoose from 'mongoose'
import { VALIDATION_MESSAGES } from '../constants/validatonMessages.js'
import { EGender, EROLE } from '../enum/user.js'
import { TUser } from '../types/user.js'
import { convertObjectToArray } from '../utils/common.js'
import { getAge } from '../utils/date.js'
import { createModel } from '../utils/mongoose.js'
import { isEmailValid } from '../utils/validator.js'

const { ADD_DOB, ADD_GENDER, ADD_ID, ADD_NAME, ADD_PHOTO, ALREADY_EXISTS } = VALIDATION_MESSAGES

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: [true, ADD_ID] },
    name: { type: String, required: [true, ADD_NAME] },
    email: {
      type: String,
      unique: [true, ALREADY_EXISTS.replace('{name}', 'email')],
      required: [true, ADD_NAME],
      validate: isEmailValid(),
    },
    photo: {
      type: String,
      required: [true, ADD_PHOTO],
    },
    role: {
      type: String,
      enum: convertObjectToArray({ data: EROLE, extract: 'values' }),
      default: EROLE.USER,
    },
    gender: {
      type: String,
      enum: convertObjectToArray({ data: EGender, extract: 'values' }),
      required: [true, ADD_GENDER],
    },
    dob: {
      type: Date,
      required: [true, ADD_DOB],
    },
  },
  { timestamps: true }
)
userSchema.virtual('age').get(function () {
  const dob: Date = this.dob
  return getAge({ dob })
})

export const UserModel = createModel<TUser>({ modelName: 'User', schema: userSchema })
