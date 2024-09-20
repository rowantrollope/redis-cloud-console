<!-- components/ServerCell.svelte -->
<script lang="ts">
    import StatusButton from "./StatusButton.svelte"
    import { type ServerWithStats, ServerState } from "$lib/types/types"
    import {
        getProvider,
        getRedisVersion,
        openRedisInsight,
    } from "$lib/redisInfo"
    import { Button } from "flowbite-svelte"
    import {
        ArrowRightOutline,
        EditOutline,
        TrashBinOutline,
    } from "flowbite-svelte-icons"
    import { calculateKeyspaceHitPercentage } from "$lib/redisInfo"
    import { createEventDispatcher } from "svelte"

    export let server: ServerWithStats
    export let columnKey: string

    const SHOW_EDIT_BUTTON = true
    const SHOW_TRASH_BUTTON = false
    const SHOW_CONNECT_BUTTON = false

    const dispatch = createEventDispatcher()

    function refreshClicked() {
        dispatch("refresh")
    }
    function connectClicked() {
        openRedisInsight(server)
    }
    function editClicked(event: MouseEvent) {
        event.stopPropagation()
        dispatch("edit")
    }
    function removeClicked(event: MouseEvent) {
        event.stopPropagation()
        dispatch("remove")
    }
</script>

<section class="text-sm">
    {#if columnKey === "name"}
        <!-- <a href={`/servers/${server.config.id}`} class="anchor hover:underline"> -->
        {server.config.name}
        <!-- </a> -->
    {:else if columnKey === "host"}
        <span class="font-mono max-w-36 text-xs overflow-ellipsis line-clamp-1">
            {server.config.host}:{server.config.port}
        </span>
    {:else if columnKey === "provider"}
        {getProvider(server)}
    {:else if columnKey === "version"}
        {getRedisVersion(server)}
    {:else if columnKey === "status"}
        <StatusButton {server}></StatusButton>
    {:else if columnKey === "memory"}
        {#if server.state === ServerState.SUCCESS && server.stats?.used_memory}
            {server.stats?.used_memory_human} / {server.stats
                ?.total_system_memory_human ?? "N/A"}
        {:else}
            -
        {/if}
    {:else if columnKey === "clients"}
        {#if server.state === ServerState.SUCCESS}
            {server.stats?.connected_clients || "-"}
            /
            <span class="text-gray-400">
                {server.stats?.maxclients}
            </span>
        {:else}
            -
        {/if}
    {:else if columnKey === "commands"}
        {server.stats?.total_commands_processed || "-"}
    {:else if columnKey === "uptime"}
        {#if server.stats?.uptime_in_days}
            {server.stats?.uptime_in_days} days
        {:else}
            -
        {/if}
    {:else if columnKey === "keyspaceHit"}
        {server.state === ServerState.SUCCESS
            ? calculateKeyspaceHitPercentage(
                  parseInt(server.stats?.keyspace_hits || "0"),
                  parseInt(server.stats?.keyspace_misses || "0")
              )
            : "N/A"}
    {:else if columnKey === "actions"}
        <div class="flex -space-x-1">
            {#if SHOW_CONNECT_BUTTON && server.state === ServerState.SUCCESS}
                <Button
                    size="xs"
                    class="bg-slate-400 text-lime-500 px-2 py-1 hover:bg-lime-500 hover:text-black"
                    on:click={connectClicked}
                >
                    Connect
                    <ArrowRightOutline class="w-5 h-5 pl-1 " />
                </Button>
            {/if}

            {#if SHOW_EDIT_BUTTON}
                <Button
                    size="xs"
                    color="none"
                    class="text-gray-500 hover:bg-slate-500 hover:text-lime-500 space-x-1"
                    on:click={editClicked}
                >
                    <div class="flex">
                        <EditOutline class="w-4 h-4" />
                        <!-- <div>edit</div> -->
                    </div>
                </Button>
            {/if}
            {#if SHOW_TRASH_BUTTON}
                <Button
                    size="xs"
                    color="none"
                    class="text-gray-500 hover:bg-slate-500 hover:text-lime-500 space-x-1"
                    on:click={removeClicked}
                >
                    <div class="flex">
                        <TrashBinOutline class="w-4 h-4" />
                        <!-- <div>edit</div> -->
                    </div>
                </Button>
            {/if}
        </div>
    {/if}
</section>
