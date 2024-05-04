import { EnumType } from 'typescript'
import { ResponseType } from '../types/common.js'

export const convertObjectToArray = (args: { data: EnumType | Object; extract?: 'keys' | 'values' | 'entries' }) => {
  const { data, extract } = args
  if (extract === 'keys') return Object.keys(data)
  if (extract === 'values') return Object.values(data)
  if (extract === 'entries') return Object.entries(data)
  return Object.keys(data)
}

export const customResponse = <T>({ success = true, statusCode = 201, res, message, data }: ResponseType<T>) => {
  return res.status(statusCode).json({
    success,
    message,
    ...(data && { data }),
  })
}
