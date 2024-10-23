<script lang="ts">
    import { type ServerWithStats } from "$lib/types/types"
    import { Button, Drawer, CloseButton } from "flowbite-svelte"
    import { ArrowRightOutline, DatabaseOutline } from "flowbite-svelte-icons"
    import { sineInOut } from "svelte/easing"
    import ServerStatsDialog from "./ServerStatsDialog.svelte"
    import EditServerDialog from "../../AddDatabase/EditServerDialog.svelte"
    import { createEventDispatcher } from "svelte"
    import { APP_NAME } from "$lib/constants"
    
    const dispatch = createEventDispatcher()
    
    export let server: ServerWithStats
    export let hidden = true

    let editInstanceModalOpen = false
    let serverStatsDialogOpen = false

    function handleEdit() {
        editInstanceModalOpen = true
    }

    function handleStats() {
        serverStatsDialogOpen = true
    }

    let transitionParams = {
        x: 320,
        duration: 300,
        easing: sineInOut,
    }
</script>

<Drawer
    placement="right"
    transitionType="fly"
    {transitionParams}
    bind:hidden
    id="sidebar5"
    width="w-96"
>
    <div class="flex flex-col space-y-2 h-full dark:text-white">
        <div class="flex items-center">
            <h5
                id="drawer-label"
                class="inline-flex items-center mb-4 text-xl font-semibold dark:text-gray-400"
            >
                <DatabaseOutline class="w-5 h-5 me-2.5" />{server.config.name}
            </h5>
            <CloseButton
                on:click={() => (hidden = true)}
                class="mb-4 dark:text-white"
            />
        </div>
        <h3 class="text-lg ">Database Details</h3>
        <div class="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg flex flex-col space-y-2">
            {#if server.config.type !== "remote"}
            <div class="flex space-x-2 w-full">
                <div class="w-1/2 text-right">
                    <strong>Host:</strong>
                </div>
                <div class="font-mono">{server.config.host}</div>
            </div>

            <div class="flex space-x-2 w-full">
                <div class="w-1/2 text-right">
                    <strong>Port:</strong>
                </div>
                <div class="font-mono">{server.config.port}</div>
            </div>
            {:else}
                <div class="text-sm mb-2">
                    Connected through {APP_NAME} Proxy
                </div>    

                <div class="flex space-x-2 w-full">
                    <div class="w-1/2 text-right">
                        <strong>Server ID:</strong>
                    </div>
                    <div class="font-mono">{server.config.id}</div>
                </div>

                <div class="flex space-x-2 w-full">
                    <div class="w-1/2 text-right">
                        <strong>Hostname:</strong>
                    </div>
                    <div class="font-mono">{server.stats?.hostname}</div>
                </div>
            {/if}

            {#if server.stats}
                {#each [
                    { label: 'Server Version', value: server.stats?.redis_version },
                    { label: 'Connected Clients', value: server.stats?.connected_clients },
                    { label: 'Used Memory', value: server.stats?.used_memory_human },
                    { label: 'System Memory', value: server.stats?.total_system_memory_human },
                    { label: 'CPU Usage', value: Number(server.stats?.used_cpu_user).toFixed(2) + "%" },
                    { label: 'Role', value: server.stats?.role }
                ] as stat}
                    <div class="flex space-x-2 w-full">
                        <div class="w-1/2 text-right">
                            <strong>{stat.label}:</strong>
                        </div>
                        <div class="font-mono">{stat.value}</div>
                    </div>
                {/each}
            {/if}
        </div>
        <button class="outline-button" on:click={handleStats}>Show all Stats</button>
        <div class="grow" />
        <button
            class="lime-button"
            on:click={() => dispatch("connect")}
        >
            Connect with Redis Insight
            <ArrowRightOutline class="w-5 h-5 ms-2" />
    </button>
        <button class="outline-button" on:click={handleEdit}>Edit Connection Details</button>
        <button class="red-outline-button" on:click={() => dispatch("remove")}>Remove</button>
    </div>
</Drawer>

<EditServerDialog
    bind:open={editInstanceModalOpen}
    {server}
    on:update={() => dispatch("update")}
    on:remove={() => dispatch("remove")}
/>
<ServerStatsDialog bind:open={serverStatsDialogOpen} {server} />
