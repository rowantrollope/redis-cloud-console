// src/lib/types.ts

export enum ServerState {
    UNKNOWN = "unknown",
    CONNECTING = "connecting",
    SUCCESS = "success",
    ERROR = "error",
}

export interface ServerConfig {
    id: string
    name: string
    host: string
    port: number
    username: string
    password?: string
}

export interface ServerStats {
    [key: string]: string
}

export interface ServerWithStats {
    config: ServerConfig
    stats?: ServerStats | null
    error?: string | null
    state: ServerState
}