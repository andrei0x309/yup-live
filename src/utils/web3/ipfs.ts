const IPFSGateWay = 'https://cloudflare-ipfs.com/ipfs/'

export const parseIpfs = (ipfs: string) => {
    if (ipfs.startsWith('ipfs://')) {
        const hash = ipfs.replace('ipfs://', '')
        return `${IPFSGateWay}${hash}`
    }
    return ipfs
}
