import { Model } from 'mongoose'

export const aggregate = async ({ modal, query }: { modal: Model<any>; query: any }) => {
  const data = await modal.aggregate(query)
  return data
}
