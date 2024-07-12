
import type { TPlatform } from "shared/src/types/web3-posting";
import type { IMainStore } from "shared/src/types/store";

export const getMaxCharCount = (platforms: TPlatform[]) => {
    if (platforms.includes('twitter')) return 280
    else if (platforms.includes('bsky')) return 300
    else if (platforms.includes('farcaster')) return 1024
    else if (platforms.includes('lens')) return 1024
    else if (platforms.includes('threads')) return 500
    return 1000
}

export const canPost = (store: IMainStore) => {
    return store.userData.connected?.twitter || store.userData.connected?.bsky || store.userData.connected?.farcaster || store.userData.connected?.lens
}
