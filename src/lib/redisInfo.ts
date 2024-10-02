import { type ServerWithStats, DatabaseType } from "$lib/types/types"

export function getProvider(server: ServerWithStats): string {
    if (!serverOnline(server)) {
        return "offline"
    }
    // if (server.config.host.includes("amazonaws")) {
    //     return `AWS Elasticache`
    // } else if (server.config.host.includes("azure")) {
    //     return `Azure Redis`
    // } else if (server.config.host.includes("memorystore")) {
    //     return `GCP Memorystore`
    // } else {
    if (server.config.type === DatabaseType.REMOTE) {
        return "Cloud Proxy"
    } else if (server.config.type === DatabaseType.CLOUD) {
        return "Redis Cloud"
    } else if (server.config.type === DatabaseType.LOCAL) {
        return "Local"
    }
    // if the host contains "redis-cloud" return "[version] on Redis Cloud
    if (
        server.config.host.includes("redis-cloud") ||
        server.config.host.includes("rlrcp.com")
    ) {
        return `Redis Cloud`
    } else return `OSS / CE`

}
export function serverOnline(server: ServerWithStats): boolean {
    return (!server.error && server.stats) ? true : false
}
export function getRedisVersion(server: ServerWithStats): string {
    if (!serverOnline(server)) {
        return "-"
    }
    const version = server.stats?.redis_version

    // if the host contains "redis-cloud" return "[version] on Redis Cloud
    if (server.config.host.includes("redis-cloud")) {
        return `${version}`
    } else if (server.config.host.includes("aws")) {
        return `${version}`
    } else if (server.config.host.includes("azure")) {
        return `${version}`
    } else if (server.config.host.includes("memorystore")) {
        return `${version}`
    } else {
        return `${version}`
    }
}
export function getLatestVersion(servers: ServerWithStats[]): string {
    const versions = servers.map((s) => s.stats?.redis_version).filter(Boolean)
    return versions.length ? versions.sort().reverse()[0] : "N/A"
}

export function openRedisInsight(server: ServerWithStats) {
    const credentials = server.config.password
        ? `default:${server.config.password}`
        : `default`

    const redisUri = encodeURIComponent(
        `redis://${credentials}@${server.config.host}:${server.config.port}`
    )

    const url = `redisinsight://databases/connect?redisUrl=${redisUri}`
    window.location.href = url
}

export function calculateTotalMemory(servers: ServerWithStats[]): number {
    return servers.reduce(
        (total, server) =>
            total + (parseInt(server.stats?.used_memory || "0") || 0),
        0
    )
}

export function calculateTotalAvailableMemory(servers: ServerWithStats[]): number {
    return servers.reduce(
        (total, server) =>
            total + (parseInt(server.stats?.total_system_memory || "0") || 0),
        0
    )
}

export function calculateTotalClients(servers: ServerWithStats[]): number {
    return servers.reduce(
        (total, server) =>
            total + (parseInt(server.stats?.connected_clients || "0") || 0),
        0
    )
}

export function calculateAvgCommands(servers: ServerWithStats[]): string {
    const total = servers.reduce(
        (total, server) =>
            total +
            (parseInt(server.stats?.total_commands_processed || "0") || 0),
        0
    )
    return (total / servers.length || 0).toFixed(2)
}

export function calculateAverageMemoryFragmentation(
    servers: ServerWithStats[]
): string {
    const fragmentation = servers.reduce(
        (total, server) =>
            total +
            (parseInt(server.stats?.mem_fragmentation_ratio || "0") || 0),
        0
    )
    return (fragmentation / servers.length || 0).toFixed(2)
}

export function formatMemory(bytes: number): string {
    const mb = bytes / (1024 * 1024)
    const gb = bytes / (1024 * 1024 * 1024)
    if (gb >= 1) {
        return `${gb.toFixed(2)} GB`
    } else if (mb >= 1) {
        return `${mb.toFixed(2)} MB`
    } else {
        return `${bytes} bytes`
    }
}

/**
 * Calculates the Keyspace Hit Percentage.
 * @param hits - Number of keyspace hits.
 * @param misses - Number of keyspace misses.
 * @returns A string representing the hit percentage.
 */
export function calculateKeyspaceHitPercentage(hits: number, misses: number): string {
    const total = hits + misses
    if (total === 0) return "N/A"
    const percentage = (hits / total) * 100
    return `${percentage.toFixed(2)}%`
}

/**
 * (Optional) Calculates total keyspace hits across all servers.
 * @param servers - Array of server objects.
 * @returns Total keyspace hits.
 */
export function calculateTotalKeyspaceHits(servers: ServerWithStats[]): number {
    return servers.reduce(
        (total, server) =>
            total + (parseInt(server.stats?.keyspace_hits || "0") || 0),
        0
    )
}

/**
 * (Optional) Calculates total keyspace misses across all servers.
 * @param servers - Array of server objects.
 * @returns Total keyspace misses.
 */
export function calculateTotalKeyspaceMisses(servers: ServerWithStats[]): number {
    return servers.reduce(
        (total, server) =>
            total + (parseInt(server.stats?.keyspace_misses || "0") || 0),
        0
    )
}
