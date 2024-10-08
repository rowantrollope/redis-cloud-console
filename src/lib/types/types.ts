// src/lib/types/types.ts

export enum ServerState {
    UNKNOWN = "unknown",
    CONNECTING = "connecting",
    SUCCESS = "success",
    ERROR = "error",
}

export enum ServerType {
    LOCAL = 'local',
    CLOUD = 'cloud',
    REMOTE = 'remote',
}
export interface ServerConfig {
    id: string
    name: string
    type: ServerType
    host?: string
    port?: number
    username?: string
    password?: string

    // Additional fields specific to each server type

    // redis.io only
    cloudAccountId?: string

    // remote server only
    databaseId?: string

    // ... other common fields
}

export interface CloudAccount {
    id: string;
    name: string; // Friendly name for the account
    accountKey: string; // Encrypted Account Key
    apiKey: string;     // Encrypted User API Key
    // Add other relevant fields if needed
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

export interface RedisCloudAccount {
    id: string;
    name: string;
    apiKey: string;
    accountKey: string;
}
