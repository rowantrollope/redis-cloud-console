import { writable } from "svelte/store"
import type { ServerWithStats, ServerConfig } from "$lib/types/types"
import { ServerState } from "$lib/types/types"

export const servers = writable<ServerWithStats[]>([])

// Initialize servers with data (used on client-side)
export async function initializeServers(initialServers: ServerConfig[]) {
    try {
        console.log("initializeServers", initialServers)
        const serverWithStats: ServerWithStats[] = initialServers.map(
            (config) => ({
                config,
                stats: null,
                error: null,
                state: ServerState.UNKNOWN,
            })
        )
        console.log("initializeServers", serverWithStats)
        servers.set(serverWithStats)

        initialServers.forEach((server: ServerConfig) =>
            refreshServerStats(server.id)
        )
    } catch (error) {
        console.error("Error initializing servers:", error)
    }
}

// Refresh stats for a specific server
export async function refreshServerStats(serverId: string) {
    console.log(`refreshServerStats - looking for ${serverId}`)
    servers.update((current) =>
        current.map((server) => {
            if (server.config.id === serverId) {
                return {
                    ...server,
                    state: ServerState.CONNECTING,
                    stats: null,
                    error: null,
                }
            }
            return server
        })
    )
    
    try {

        const response = await fetch(`/api/redisstats?id=${serverId}`, {
            credentials: "include",
        })
        if (!response.ok) {
            throw new Error("Failed to fetch stats")
        }
        const stats = await response.json()

        servers.update((current) =>
            current.map((server) =>
                server.config.id === serverId
                    ? {
                          ...server,
                          stats,
                          state: ServerState.SUCCESS,
                          error: null,
                      }
                    : server
            )
        )
    } catch (error: any) {
        console.error(`Error refreshing server ${serverId}:`, error)
        servers.update((current) =>
            current.map((server) =>
                server.config.id === serverId
                    ? {
                          ...server,
                          state: ServerState.ERROR,
                          error: error.message,
                          stats: null,
                      }
                    : server
            )
        )
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
        refreshServerStats(updatedConfig.id)
    } catch (error: any) {
        console.error(`Error updating server ${updatedConfig.id}:`, error)
        // Optionally, set an error state here
    }
}

// Remove a server configuration
export async function removeServer(serverId: string) {
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
export async function addServer(newConfig: ServerConfig) {
    try {
        const response = await fetch("/api/servers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newConfig),
            credentials: "include",
        })
        if (!response.ok) {
            throw new Error("Failed to add server")
        }
        servers.update((current) => [
            ...current,
            {
                config: newConfig,
                stats: null,
                error: null,
                state: ServerState.CONNECTING,
            },
        ])
        refreshServerStats(newConfig.id)
    } catch (error: any) {
        console.error("Error adding server:", error)
    }
}
