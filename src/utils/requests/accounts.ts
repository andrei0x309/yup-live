import { getNormalizedValue, getMaxVote, MAX_DELETE_VOTE, MAX_FOLLOW_USAGE, makePercentage, makeRandAvatar, noBio } from '../accounts'
import { formatNumber, truncteEVMAddr } from '../misc'
import type { IUserData } from '@/types/account'
import type { NameValue } from '@/types/account'

const API_BASE = import.meta.env.VITE_YUP_API_BASE

export const getUserFollowers = async (userId: string) => {
  try {
    const req = await fetch(`${API_BASE}/followers/${userId}`)
    if (req.ok) {
      return { error: false, data: await req.json() }
    }
    return { error: true, msg: "API didn't return expected response." }
  } catch {
    return { error: true, msg: 'API is not available' }
  }
}

export const getActionUsage = async (userId: string) => {
  try {
    const req = await fetch(`${API_BASE}/accounts/actionusage/${userId}`)
    if (req.ok) {
      return { error: false, data: await req.json() }
    }
    return { error: true, msg: "API didn't return expected response." }
  } catch {
    return { error: true, msg: 'API is not available' }
  }
}

export const createActionUsage = async (userId: string, balance: number) => {
  const data = await getActionUsage(userId)
  if (data.error) return { error: true, msg: 'API returned error' }
  const MAX_VOTE = getMaxVote(balance)
  return {
    nextReset: new Date(data.data.lastReset + 864e5).toLocaleString(),
    actionBars: {
      deleteVote: makePercentage(getNormalizedValue(MAX_DELETE_VOTE - data.data.deleteVoteCount, 0, MAX_DELETE_VOTE)),
      follow: makePercentage(getNormalizedValue(MAX_FOLLOW_USAGE - data.data.followCount, 0, MAX_FOLLOW_USAGE)),
      vote: makePercentage(getNormalizedValue(MAX_VOTE - data.data.createVoteCount, 0, MAX_VOTE))
    }
  }
}

export const getUserData = async (userId: string, refreshWeight = false) => {
  try {
    const req = await fetch(`${API_BASE}/accounts/${userId}`)
    if (req.ok) {
      const data = await req.json()
      if (refreshWeight) {
        localStorage.setItem('weight', data.weight)
      }
      return { error: false, data }
    }
    return { error: true, msg: "API didn't return expected response." }
  } catch {
    return { error: true, msg: 'API is not available' }
  }
}

export const createUserData = async (userId: string, refreshWeight = false) => {
  const d = await getUserData(userId, refreshWeight)
  if (d.error) return { error: true, msg: d.msg, data: { userData: {} as unknown as IUserData, userFields: [] as Array<NameValue> } }
  const {
    _id,
    username,
    balance,
    total_vote_value,
    total_claimed_rewards,
    weight,
    lastAddRewardTxDateCreator,
    lastAddRewardTxDateCurator,
    score,
    avatar,
    twitterInfo,
    cum_deposit_time,
    bio,
    createdAt,
    ethInfo
  } = d.data
  const returnData = {
    userData: {
      username: username,
      balance: formatNumber(balance.YUP),
      balanceNum: balance.YUP,
      weight: formatNumber(weight),
      score: formatNumber(score),
      avatar: avatar ? (avatar.startsWith('https://ipfs2.yup.io') ? makeRandAvatar(_id) : avatar) : makeRandAvatar(_id),
      bio: !bio ? noBio(username) : bio,
      evmAddress: ethInfo?.address ?? ''
    } as IUserData,
    userFields: [] as Array<NameValue>
  }

  const userInfoFields = [
    {
      name: 'Created At:',
      value: createdAt
    },
    {
      name: 'Cumulative Deposit Time',
      value: formatNumber(cum_deposit_time)
    },
    {
      name: 'Total Rewards Claimed',
      value: formatNumber(total_claimed_rewards)
    },
    {
      name: 'Total Vote Value',
      value: formatNumber(total_vote_value)
    },
    {
      name: 'Last Curator Reward',
      value: lastAddRewardTxDateCurator
    },
    {
      name: 'Last Creator Reward',
      value: lastAddRewardTxDateCreator
    }
  ]
  if (ethInfo?.address) {
    userInfoFields.splice(1, 0, {
      name: 'Linked ETH Address',
      value: truncteEVMAddr(ethInfo.address)
    })
  } else {
    userInfoFields.splice(1, 0, {
      name: 'Linked ETH Address',
      value: 'Not linked'
    })
  }
  if (ethInfo?.isMirror) {
    userInfoFields.splice(2, 0, {
      name: 'Mirror Account',
      value: 'Yes'
    })
  } else {
    userInfoFields.splice(2, 0, {
      name: 'Mirror Account',
      value: 'No'
    })
  }
  if (twitterInfo?.userId) {
    userInfoFields.push({
      name: 'Twitter ID',
      value: twitterInfo.userId
    })
  } else {
    userInfoFields.push({
      name: 'Twitter ID',
      value: 'Not linked'
    })
  }
  returnData.userFields = userInfoFields
  return { error: false, data: returnData }
}
