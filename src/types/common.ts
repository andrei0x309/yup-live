export interface NameValue {
    name: string
    value: string
}

export interface PartialAccountInfo {
    _id: string
    avatar: string
    [key: string]: string | unknown | Record<string, unknown>
}
