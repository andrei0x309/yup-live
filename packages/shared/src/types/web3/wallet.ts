export interface IProfileToken {
    address: string
    balance: number
    image: string
    name: string
    symbol: string
}

export interface IProfileNFT {
    address: string
    collectionImageURI: string
    collectionName: string
    imageURI: string
    link: string
    tokenId: number
}

export interface IProfilePOAP {
    description: string
    eventId: string
    image: string
    link: string
    title: string
}
