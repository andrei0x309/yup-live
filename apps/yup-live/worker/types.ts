export interface T_FRAME_API_BODY {
    untrustedData: {
        fid: number
        url: string
        messageHash: string
        timestamp: number
        network: number
        buttonIndex: number
        inputText: string
        castId: {
            fid: number
            hash: string
        }
        state: string
    }
    trustedData: {
        messageBytes: string
    }
}