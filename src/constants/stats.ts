export const today = new Date()

export const thisMonth = {
  start: new Date(today.getFullYear(), today.getMonth(), 1),
  end: today
}
export const lastMonth = {
  start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
  end: new Date(today.getFullYear(), today.getMonth(), 0)
}

export const sixMonthAgo = () => {
  const currentDate = new Date()
  currentDate.setMonth(today.getMonth() - 6)
  return currentDate
}
export const twelveMonthAgo = () => {
  const currentDate = new Date()
  currentDate.setMonth(today.getMonth() - 12)
  return currentDate
}
