export const noBio = (username: string) =>
  `Hi there I am ${username} I signed up on YUP DApp but I haven't written anything about myself yet.`

export const getNormalizedValue = (val: number, min: number, max: number) => {
  return Math.floor(((val - min) / (max - min)) * 100)
}

export const getMaxVote = (balance: number) => {
  return balance >= 100 ? 250 : balance >= 0.5 ? 190 : 130
}

export const makePercentage = (val: number) => {
  return `${val}%`
}

export const MAX_DELETE_VOTE = 600
export const MAX_FOLLOW_USAGE = 60

export const makeRandAvatar = (seed: string) => `https://avatars.dicebear.com/api/avataaars/${seed}.svg`
