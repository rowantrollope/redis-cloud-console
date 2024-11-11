import { type ServerWithStats, ServerType } from "$lib/types/types"

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
    if (server.config.type === ServerType.REMOTE) {
        return "Cloud Proxy"
    } else if (server.config.type === ServerType.CLOUD) {
        return "Redis Cloud"
    } else if (server.config.type === ServerType.LOCAL) {
        return "Local"
    }
    // if the host contains "redis-cloud" return "[version] on Redis Cloud
    if (
        server.config.host?.includes("redis-cloud") ||
        server.config.host?.includes("rlrcp.com")
    ) {
        return `Redis Cloud`
    } else return `OSS / CE`

}
export function serverOnline(server: ServerWithStats): boolean {
    return (!server.error && server.stats) ? true : false
}
export function getRedisVersion(server: ServerWithStats): string {
    if (server.stats?.redis_version == "255.255.255") {
        return "OSS/CE: 7.4"
    }

    // if the host contains "redis-cloud" return "[version] on Redis Cloud
    if (server.config.host?.includes("redis-cloud")) {
        return `Redis Cloud: ${server.stats?.redis_version}`
    } else if (server.config.host?.includes("aws")) {
        return `AWS: ${server.stats?.redis_version}`
    } else if (server.config.host?.includes("azure")) {
        return `Azure: ${server.stats?.redis_version}`
    } else if (server.config.host?.includes("memorystore")) {
        return `GCP: ${server.stats?.redis_version}`
    } else {
        return `${server.stats?.redis_version}`
    }
}
export function getLatestVersion(servers: ServerWithStats[]): string {
    const versions = servers.map((s) => s.stats?.redis_version).filter(Boolean)
    return versions.length ? versions.sort().reverse()[0] : "N/A"
}

export async function openRedisInsight(server: ServerWithStats) {
    const credentials = server.config.password
        ? `default:${server.config.password}`
        : `default`

    let host: string = ""
    let port: string = ""

    if (server.config.type === ServerType.REMOTE) {
        // retrieve host and port from /connect method on redis-cloud-server 
        // method takes querystring: ?redis_server_id= 
        console.log("Opening RedisInsight through proxy server")
        const response = await fetch(
            `https://redis-proxy-server.onrender.com/connect?redis_server_id=${server.config.id}`
        )
        const data = await response.json()
        host = "https://redis-proxy-server.onrender.com"
        port = data.port
        console.log(`Opening port to RedisInsight host: ${host} port: ${port}`)
    } else {
        host = server.config.host ?? ""
        port = server.config.port?.toString() ?? ""
    }

    const redisUri = encodeURIComponent(
        `redis://${credentials}@${host}:${port}`
    )

    console.log(`redisUri: ${redisUri}`)

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

export function calculateAverageCPUUtilization(servers: ServerWithStats[]): number {
    const total = servers.reduce(
        (total, server) =>
            total + (parseInt(server.stats?.used_cpu_sys || "0") || 0),
        0
    )
    return (total / servers.length || 0)
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
    if (total === 0) return "-"
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
