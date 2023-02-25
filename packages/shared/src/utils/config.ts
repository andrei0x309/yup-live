interface ConfigFields {
    API_BASE: string,
    POLY_RPC: string,
}

class Config {
    API_BASE: string = ''
    POLY_RPC: string = ''

    setConfig (config: ConfigFields): void {
        this.API_BASE = config.API_BASE
        this.POLY_RPC = config.POLY_RPC
    }

}

export const config = new Config()
