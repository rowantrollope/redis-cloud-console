import { writable, get } from "svelte/store"
import type { ServerWithStats, ServerConfig } from "$lib/types/types"
import { ServerState } from "$lib/types/types"
import { type RedisCloudAccount, ServerType } from "$lib/types/types"
import {
    fetchRemoteServer,
    removeRemoteServer,
} from "$lib/services/redisCloudServerService"

export const servers = writable<ServerWithStats[]>([])
export const cloudAccounts = writable<RedisCloudAccount[]>([])

// Fetch cloud accounts from the server
export async function fetchCloudAccounts() {
    try {
        const response = await fetch("/api/cloud-accounts")
        if (!response.ok) {
            throw new Error("Failed to fetch cloud accounts")
        }
        const accounts: RedisCloudAccount[] = await response.json()
        cloudAccounts.set(accounts)
    } catch (error) {
        console.error("Error fetching cloud accounts:", error)
    }
}

export async function fetchAllCloudDatabases(): Promise<ServerWithStats[]> {
    try {
        const response = await fetch("/api/cloud-databases")
        if (!response.ok) {
            throw new Error("Failed to fetch cloud databases")
        }

        const cloudDatabases: ServerWithStats[] = await response.json()
        return cloudDatabases
    } catch (error) {
        console.error("Error fetching cloud databases:", error)
        return []
    }
}
export async function fetchCloudAccountDatabases(
    accountId: string
): Promise<ServerWithStats[]> {
    try {
        const response = await fetch(
            `/api/cloud-accounts/${accountId}/databases`
        )
        if (!response.ok) {
            throw new Error("Failed to fetch cloud databases")
        }

        const cloudDatabases: ServerWithStats[] = await response.json()
        return cloudDatabases
    } catch (error) {
        console.error("Error fetching cloud databases:", error)
        return []
    }
}

export async function initializeServerStore(initialServers: ServerConfig[]) {
    try {
        // Initialize servers
        let serversWithStats = initialServers.map((server) => ({
            config: server,
            stats: null,
            error: null,
            state: ServerState.UNKNOWN,
        })) as ServerWithStats[]

        const LOAD_CLOUD_SERVERS = true

        // Cloud Servers (OLD CODE TODO: UPDATE)
        if (LOAD_CLOUD_SERVERS) {
            // TODO: get the cloud servers
            const cloudServers = await fetchAllCloudDatabases()
            serversWithStats = [...serversWithStats, ...cloudServers]
            // combine the initial servers with the cloud servers
        }

        if (serversWithStats.length > 0) {
            await initializeServerStats(serversWithStats)
        }

        servers.set(serversWithStats)
    } catch (error) {
        console.error("Error initializing stores:", error)
    }
}
export async function initializeCloudAccountStore(
    initialCloudAccounts: RedisCloudAccount[]
) {
    // Set the cloud accounts store
    cloudAccounts.set(initialCloudAccounts)
}

// Initialize servers with data (used on client-side)
export async function initializeServerStats(initialServers: ServerWithStats[]) {
    try {
        console.log("initializeServerStats", initialServers)

        initialServers.forEach((server: ServerWithStats) =>
            refreshServer(server)
        )
    } catch (error) {
        console.error("Error initializing servers:", error)
    }
}

// Refresh stats for a specific server
export async function refreshServer(server: ServerWithStats) {
    server.state = ServerState.CONNECTING

    if (server.config.type === ServerType.REMOTE) {
        // Fetch stats via redis-cloud-server
        console.log("fetching info for remote server", server.config.id)
        try {
            const data = await fetchRemoteServer(server.config.id)
            console.log("stats", data.stats)

            server.config.status = data.serverInfo.status
            server.config.timestamp = data.serverInfo.timestamp
            server.config.activation_state = data.serverInfo.activation_state
            server.config.account_id = data.serverInfo.account_id
            server.config.agent_id = data.serverInfo.agent_id
                
            servers.update((current) =>
                current.map((s) =>
                    s.config.id === server.config.id
                        ? {
                              ...s,
                              config: server.config,
                              stats: data.stats,
                              state: ServerState.SUCCESS,
                              error: null,
                          }
                        : s
                )
            )
        } catch (error: any) {
            console.error(
                `Error refreshing stats for REMOTE server ${server.config.id}:`,
                error
            )
            servers.update((current) =>
                current.map((s) =>
                    s.config.id === server.config.id
                        ? {
                              ...s,
                              state: ServerState.ERROR,
                              error: error.message,
                          }
                        : s
                )
            )
        }
    } else {
        console.log(
            `loading stats for ${server.config.id} ${server.config.type}`
        )
        try {
            const response = await fetch(
                `/api/redisstats?id=${
                    server.config.id
                }&serverConfig=${encodeURIComponent(
                    JSON.stringify(server.config)
                )}`,
                {
                    credentials: "include",
                }
            )
            if (!response.ok) {
                throw new Error("Failed to fetch stats")
            }
            const stats = await response.json()

            servers.update((current) =>
                current.map((s) =>
                    s.config.id === server.config.id
                        ? {
                              ...s,
                              stats,
                              state: ServerState.SUCCESS,
                              error: null,
                          }
                        : s
                )
            )
        } catch (error: any) {
            console.error(`Error refreshing server ${server.config.id}:`, error)
            servers.update((current) =>
                current.map((s) =>
                    s.config.id === server.config.id
                        ? {
                              ...s,
                              state: ServerState.ERROR,
                              error: error.message,
                              stats: null,
                          }
                        : s
                )
            )
        }
    }
}

// Update a server configuration
export async function updateServer(updatedConfig: ServerConfig) {
    try {
        const response = await fetch(`/api/servers`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedConfig),
            credentials: "include",
        })
        if (!response.ok) {
            throw new Error("Failed to update server")
        }
        servers.update((current) =>
            current.map((server) =>
                server.config.id === updatedConfig.id
                    ? {
                          ...server,
                          config: updatedConfig,
                          state: ServerState.CONNECTING,
                      }
                    : server
            )
        )
        const server = get(servers).find(
            (server) => server.config.id === updatedConfig.id
        )
        if (server) {
            refreshServer(server)
        }
    } catch (error: any) {
        console.error(`Error updating server ${updatedConfig.id}:`, error)
        // Optionally, set an error state here
    }
}

// Remove a server configuration
export async function removeServer(serverId: string) {
    // TODO: Check if the server is connected to a remote redis cloud server
    // TODO: If it is, then remove the server from the remote server
    // TODO: Otherwise, remove the server from the local server
    // TODO: Update the UI to reflect the removal

    const server = get(servers).find((server) => server.config.id === serverId)

    if (!server) {
        console.error(`Server ${serverId} not found`)
        return
    }

    try {
        const response = await fetch(`/api/servers?id=${serverId}`, {
            method: "DELETE",
            credentials: "include",
        })
        if (!response.ok) {
            throw new Error("Failed to delete server")
        }
        servers.update((current) =>
            current.filter((server) => server.config.id !== serverId)
        )
    } catch (error: any) {
        console.error(`Error deleting server ${serverId}:`, error)
    }
}

// Add a new server configuration
export async function addServer(config: ServerConfig) {
    console.log("addServer", config)
    try {
        const response = await fetch("/api/servers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(config),
            credentials: "include",
        })
        const newServer = {
            config: config,
            stats: null,
            error: null,
            state: ServerState.CONNECTING,
        }
        if (!response.ok) {
            throw new Error("Failed to add server")
        }
        servers.update((current) => [...current, newServer])
        refreshServer(newServer)
    } catch (error: any) {
        console.error("Error adding server:", error)
    }
}

export async function addCloudAccount(account: RedisCloudAccount) {
    try {
        const response = await fetch("/api/cloud-accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(account),
        })

        if (!response.ok) {
            throw new Error("Failed to add cloud account")
        }

        // Optionally, you can update the local store upon success
        cloudAccounts.update((accounts) => [...accounts, account])

        // Update the server list to include new cloud databases

        // TODO: fetch servers from the cloud account
        // TODO: update the server list with the new servers
        // TODO: update the UI to show the new servers
        servers.set([
            ...get(servers),
            ...(await fetchCloudAccountDatabases(account.id)),
        ])
    } catch (error) {
        console.error("Error adding cloud account:", error)
    }
}

export async function removeCloudAccount(accountId: string) {
    try {
        const response = await fetch(`/api/cloud-accounts?id=${accountId}`, {
            method: "DELETE",
        })

        if (!response.ok) {
            throw new Error("Failed to remove cloud account")
        }

        cloudAccounts.update((accounts) =>
            accounts.filter((acc) => acc.id !== accountId)
        )
        // remove the databases from the server list
        servers.update((current) =>
            current.filter(
                (server) => server.config.cloudAccountId !== accountId
            )
        )
    } catch (error) {
        console.error("Error removing cloud account:", error)
    }
}
