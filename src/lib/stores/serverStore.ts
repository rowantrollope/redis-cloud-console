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

export async function* fetchAllCloudDatabases(): AsyncGenerator<ServerWithStats> {
    try {
        const response = await fetch("/api/cloud-databases");
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("No reader found");
        }
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Save incomplete JSON

            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const server: ServerWithStats = JSON.parse(line);
                        yield server; // Yield each server as it's parsed
                    } catch (parseError) {
                        console.error("Error parsing server data:", parseError);
                    }
                }
            }
        }

        // Handle any remaining data in buffer
        if (buffer.trim()) {
            try {
                const server: ServerWithStats = JSON.parse(buffer);
                yield server;
            } catch (parseError) {
                console.error("Error parsing server data:", parseError);
            }
        }
    } catch (error) {
        console.error("Error fetching cloud databases:", error);
    }
}

export async function* fetchCloudAccountDatabases(
    accountId: string
): AsyncGenerator<ServerWithStats> {
    try {
        console.log("fetchCloudAccountDatabases", accountId);
        const response = await fetch(
            `/api/cloud-accounts/${accountId}/databases`
        );
        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error("ReadableStream not supported in this browser.");
        }
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Save incomplete JSON

            for (const line of lines) {
                if (line.trim()) {
                    try {
                        const server: ServerWithStats = JSON.parse(line);
                        console.log("Received server:", server);
                        yield server; // Yield each server as it's parsed
                    } catch (err) {
                        console.error("Error parsing server data:", err);
                    }
                }
            }
        }

        // Handle any remaining data in the buffer
        if (buffer.trim()) {
            try {
                const server: ServerWithStats = JSON.parse(buffer);
                console.log("Received server:", server);
                yield server;
            } catch (err) {
                console.error("Error parsing server data:", err);
            }
        }
    } catch (error) {
        console.error("Error fetching cloud databases:", error);
    }
}

export async function initializeServerStore(initialServers: ServerConfig[]) {
    try {
        console.log("initializeServerStore", initialServers)
        // Initialize servers with initial configurations
        let serversWithStats = initialServers.map((server) => ({
            config: server,
            stats: null,
            error: null,
            state: ServerState.UNKNOWN,
        })) as ServerWithStats[]

        // Initially set the servers store with the initial servers
        servers.set(serversWithStats)

        if (serversWithStats.length > 0) {
            console.log("initializeServerStore: initializing server stats")
            for (const server of serversWithStats) {
                refreshServer(server)
            }
        }

        const LOAD_CLOUD_SERVERS = true

        if (LOAD_CLOUD_SERVERS) {
            // Fetch cloud servers and update the servers store dynamically
            for await (const server of fetchAllCloudDatabases()) {
                // Initialize server state
                const newServer: ServerWithStats = {
                    config: server.config,
                    stats: null,
                    error: null,
                    state: ServerState.CONNECTING,
                }

                // Add the new server to the servers store
                servers.update((current) => [...current, newServer])
                // Refresh server stats
                refreshServer(newServer)
            }
        }
        console.log("initializeServerStore DONE")
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

// Refresh stats for a specific server
export async function refreshServer(server: ServerWithStats) {

    server.state = ServerState.CONNECTING;

    if (server.config.type === ServerType.REMOTE) {
        // Fetch stats via redis-cloud-server
        console.log("fetching info for remote server", server.config.id);
        try {
            const data = await fetchRemoteServer(server.config.id);
            console.log("stats", data.stats);

            server.config.status = data.serverInfo.status;
            server.config.timestamp = data.serverInfo.timestamp;
            server.config.activation_state = data.serverInfo.activation_state;
            server.config.account_id = data.serverInfo.account_id;
            server.config.agent_id = data.serverInfo.agent_id;

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
            );
        } catch (error: any) {
            console.error(
                `Error refreshing stats for REMOTE server ${server.config.id}:`,
                error
            );
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
            );
        }
    } else {
        console.log(
            `loading stats for ${server.config.id} ${server.config.type}`
        );
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
            );
            if (!response.ok) {
                throw new Error("Failed to fetch stats");
            }
            const stats = await response.json();

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
            );
        } catch (error: any) {
            console.error(`Error refreshing server ${server.config.id}:`, error);
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
            );
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
        });

        if (!response.ok) {
            throw new Error("Failed to add cloud account");
        }

        // Update the cloud accounts store
        cloudAccounts.update((accounts) => [...accounts, account]);

        // Collect servers from the async generator
        const newServers: ServerWithStats[] = [];
        for await (const server of fetchCloudAccountDatabases(account.id)) {
            newServers.push(server);
        }

        // Update the servers store with the new servers
        servers.set([
            ...get(servers),
            ...newServers,
        ]);

        // Optionally, refresh server stats for the new servers
        for (const server of newServers) {
            refreshServer(server);
        }
    } catch (error) {
        console.error("Error adding cloud account:", error);
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
