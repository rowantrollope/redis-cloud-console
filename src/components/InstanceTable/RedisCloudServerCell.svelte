<!-- components/ServerCell.svelte -->
<script lang="ts">
    import StatusButton from "./StatusButton.svelte"
    import { type CloudServerConfig, ServerState, DatabaseType } from "$lib/types/types"
    import {
        getProvider,
        getRedisVersion,
        openRedisInsight,
    } from "$lib/redisInfo"
    import { Button } from "flowbite-svelte"
    import {
        DotsHorizontalOutline,
        EditOutline,
        TrashBinOutline,
        ArrowRightOutline,
    } from "flowbite-svelte-icons"
    import { calculateKeyspaceHitPercentage } from "$lib/redisInfo"
    import { createEventDispatcher } from "svelte"
    import { type ServerWithStats } from "$lib/types/types"
    
    export let server: ServerWithStats
    export let columnKey: string

    const SHOW_EDIT_BUTTON = false
    const SHOW_TRASH_BUTTON = false
    const SHOW_CONNECT_BUTTON = false
    const SHOW_ACTION_DRAWER = true

    const dispatch = createEventDispatcher()

    function connectClicked(event: MouseEvent) {
        console.log("connect clicks")
        openRedisInsight(server)
    }
    function editClicked(event: MouseEvent) {
        event.stopPropagation()
        dispatch("edit")
        // hidden =! hidden
    }
    function menuClicked(event: MouseEvent) {
        event.stopPropagation()
        dispatch("menu")
        // hidden =! hidden
    }
    function removeClicked(event: MouseEvent) {
        event.stopPropagation()
        dispatch("remove")
    }
</script>

<section class="text-sm">
    {#if columnKey === "name"}
        <button class="flex hover:underline text-left" on:click={connectClicked}>
            {server.name}
        </button>
    {:else if columnKey === "host"}
        <span class="font-mono max-w-36 text-xs overflow-ellipsis line-clamp-1">
            {server.host}:{server.port}
        </span>
    {:else if columnKey === "provider"}
        {server.provider}
    {:else if columnKey === "version"}
        {server.version}
    {:else if columnKey === "status"}
        <StatusButton server={server}></StatusButton>
    {:else if columnKey === "memory"}
        {server.memoryUsedInMb} / {server.memoryLimitInGb}
    {:else if columnKey === "clients"}
        -
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
            {#if SHOW_ACTION_DRAWER}
                <Button
                    color="none"
                    on:click={(event) => {
                        event.stopPropagation()
                        menuClicked(event)
                    }}
                >
                    <DotsHorizontalOutline />
                </Button>
            {/if}
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
