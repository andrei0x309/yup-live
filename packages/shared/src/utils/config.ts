interface ConfigFields {
    API_BASE: string,
    POLY_RPC: string,
    BASE_URL: string,
}

class Config {
    API_BASE: string = 'https://api.yup.io'
    POLY_RPC: string = ''
    BASE_URL: string = 'https://yup-live.pages.dev'

    setConfig (config: ConfigFields): void {
        this.API_BASE = config.API_BASE
        this.POLY_RPC = config.POLY_RPC
    }

}

export const config = new Config()
