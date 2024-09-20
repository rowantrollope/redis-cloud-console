<script lang="ts">
    import { goto } from "$app/navigation"
    import type { ServerStats } from "$lib/redisInfo"

    export let data
    let { serverConfig, info } = data

    let error: string | null = null

    async function updateServer(event: Event) {
        event.preventDefault()
        if (!serverConfig) return

        try {
            const response = await fetch(
                `/api/servers/?id=${serverConfig.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(serverConfig),
                }
            )

            if (!response.ok) {
                throw new Error("Failed to update server")
            }

            alert("Server updated successfully")
        } catch (err) {
            alert(`Error updating server: ${err.message}`)
        }
    }

    async function deleteServer() {
        if (confirm("Are you sure you want to delete this server?")) {
            try {
                const response = await fetch(
                    `/api/servers/?id=${serverConfig.id}`,
                    {
                        method: "DELETE",
                    }
                )

                if (!response.ok) {
                    throw new Error("Failed to delete server")
                }

                alert("Server deleted successfully")
                goto("/")
            } catch (err) {
                alert(`Error deleting server: ${err.message}`)
            }
        }
    }
</script>

<div class="container mx-auto p-4">
    {#if error}
        <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
        >
            <p class="font-bold">Error:</p>
            <p>{error}</p>
        </div>
    {/if}
    {#if serverConfig}
        <form on:submit={updateServer} class="mb-8 card p-4 bg-white border">
            <h2 class="text-xl text-left font-bold mb-4">
                Redis Server Connection Details
            </h2>
            <div class="mb-4">
                <label
                    for="name"
                    class="block text-sm font-medium text-gray-700">Name</label
                >
                <input
                    type="text"
                    id="name"
                    bind:value={serverConfig.name}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <div class="mb-4">
                <label
                    for="host"
                    class="block text-sm font-medium text-gray-700">Host</label
                >
                <input
                    type="text"
                    id="host"
                    bind:value={serverConfig.host}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <div class="mb-4">
                <label
                    for="port"
                    class="block text-sm font-medium text-gray-700">Port</label
                >
                <input
                    type="number"
                    id="port"
                    bind:value={serverConfig.port}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                />
            </div>
            <div class="mb-4">
                <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                    >Password</label
                >
                <input
                    type="password"
                    id="password"
                    bind:value={serverConfig.password}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </div>
            <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Update Server
            </button>
            <button
                on:click={deleteServer}
                class="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
                Delete Server
            </button>
        </form>
    {/if}

    {#if info}
        <div class="card border p-4 bg-white">
            <h2 class="text-xl font-bold mb-2">
                {serverConfig.name} - Server Stats
            </h2>
            <div class="px-4 py-5 sm:p-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    {#each Object.entries(info) as [key, value]}
                        <div class="sm:col-span-1">
                            <dt class="text-sm font-medium text-gray-500">
                                {key}
                            </dt>
                            <dd class="mt-1 text-sm text-gray-900">{value}</dd>
                        </div>
                    {/each}
                </dl>
            </div>
        </div>
    {/if}
</div>
