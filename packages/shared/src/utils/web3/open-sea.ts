const chainIdToOpenSeaChainId = {
    '1': 'ethereum',
    '7777777': 'zora',
    '42161': 'arbitrum',
    '43114': 'avalanche',
    '137': 'matic',
    '56': 'bsc',
    '8453': 'base',
    '8217': 'klaytn',
    '10': 'optimism'
} as Record<string, string>;



export const getOpenSeaNftUrl = (nftUrl: string) => {
    const url = nftUrl.split(':');
    const chainId = url[1];
    const contractAddress = url[2];
    const tokenId = url[3];
    if (chainIdToOpenSeaChainId?.[chainId]) {
        return `https://opensea.io/assets/${chainIdToOpenSeaChainId[chainId]}/${contractAddress}/${tokenId}`
    }
    return null;
}
