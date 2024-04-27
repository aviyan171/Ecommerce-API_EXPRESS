import { EnumType } from 'typescript'

export const convertObjectToArray = (args: { data: EnumType | Object; extract?: 'keys' | 'values' | 'entries' }) => {
  const { data, extract } = args
  if (extract === 'keys') return Object.keys(data)
  if (extract === 'values') return Object.values(data)
  if (extract === 'entries') return Object.entries(data)
  return Object.keys(data)
}
