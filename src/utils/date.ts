export const getAge = ({ dob }: { dob: Date }) => {
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()

  if (today.getMonth() < dob.getMonth()) {
    age -= 1
  }
  if (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate()) {
    age -= 1
  }
  return age
}
