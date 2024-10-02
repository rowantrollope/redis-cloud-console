// src/lib/types/types.ts

export enum ServerState {
    UNKNOWN = "unknown",
    CONNECTING = "connecting",
    SUCCESS = "success",
    ERROR = "error",
}

export enum DatabaseType {
    LOCAL = 'local',
    CLOUD = 'cloud',
    REMOTE = 'remote',
}

export interface BaseServerConfig {
    id: string;
    name: string;
    type: DatabaseType;
}

export interface LocalServerConfig extends BaseServerConfig {
    type: DatabaseType.LOCAL;
    host: string;
    port: number;
    password: string;
    username: string;
}

export interface CloudServerConfig extends BaseServerConfig {
    type: DatabaseType.CLOUD
    cloudAccountId: string // Reference to the CloudAccount
    databaseId: number
    provider: string
    version: string
    status: string
    memoryUsedInMb: string
    memoryLimitInGb: string
    host: string
    port: number
    username?: string
    password?: string

    // Include other fields from Redis Cloud API response
}

export interface RemoteServerConfig extends BaseServerConfig {
    type: DatabaseType.REMOTE

    // Include other fields from Redis Cloud API response
}

export type ServerConfig = LocalServerConfig | CloudServerConfig | RemoteServerConfig;

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
