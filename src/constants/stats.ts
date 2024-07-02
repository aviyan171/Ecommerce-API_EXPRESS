const today = new Date()

export const thisMonth = {
  start: new Date(today.getFullYear(), today.getMonth(), 1),
  end: today
}
export const lastMonth = {
  start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
  end: new Date(today.getFullYear(), today.getMonth(), 0)
}
