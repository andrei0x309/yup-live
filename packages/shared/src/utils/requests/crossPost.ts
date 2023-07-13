
import type { TPlatform } from "shared/src/types/web3-posting";

export const getMaxCharCount = (platforms: TPlatform[]) => {
    if (platforms.includes('twitter')) return 280
    else if (platforms.includes('bsky')) return 300
    else if (platforms.includes('farcaster')) return 320
    return 1000
}