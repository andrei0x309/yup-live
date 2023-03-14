interface ConfigFields {
    API_BASE?: string,
    POLY_RPC?: string,
    BASE_URL?: string,
}

class Config {
    API_BASE: string = 'https://api.yup.io'
    POLY_RPC: string = 'https://polygon-rpc.com'
    BASE_URL: string = 'https://yup-live.pages.dev'

    setConfig (config: ConfigFields): void {
        if (config.BASE_URL) this.BASE_URL = config.BASE_URL
        if (config.API_BASE) this.API_BASE = config.API_BASE
        if (config.POLY_RPC) this.POLY_RPC = config.POLY_RPC
    }

}

export const config = new Config()
