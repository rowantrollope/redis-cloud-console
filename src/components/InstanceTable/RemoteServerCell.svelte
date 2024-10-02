<!-- src/components/InstanceTable/RemoteServerCell.svelte -->
<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import type { ServerWithStats } from "$lib/types/types"
    import StatusButton from "./StatusButton.svelte"
    import ActionButton from "./ActionButton.svelte"
    import { ServerState } from "$lib/types/types"
    import { calculateKeyspaceHitPercentage } from "$lib/redisInfo"
    import {
        getProvider,
        getRedisVersion,
        openRedisInsight,
    } from "$lib/redisInfo"

    export let server: ServerWithStats
    export let columnKey: string

    const dispatch = createEventDispatcher()

    function viewStats() {
        dispatch("viewStats", { server })
    }

    function refreshClicked() {
        dispatch("refresh")
    }
    function connectClicked() {
        console.log("connect clicks")
        openRedisInsight(server)
    }
    function editClicked() {
        dispatch("edit")
    }
    function menuClicked() {
        dispatch("menu")
    }
    function removeClicked() {
        dispatch("remove")
    }
</script>

<div class="">
    {#if columnKey === "name"}
        <button on:click={viewStats}>{server.config.name}</button>
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
    {:else if columnKey === "status"}
        <!-- Display status based on server.state -->
        <StatusButton {server} />
    {:else if columnKey === "host"}
        <!-- include the first 2 parts of the id -->
        {server.config.id.split("-").slice(0, 2).join("-")}...
    {:else if columnKey === "provider"}
        {getProvider(server)}
    {:else if columnKey === "version"}
        {server.stats?.redis_version ?? "-"}
    {:else if columnKey === "memory"}
        {server.stats?.used_memory_human ?? "-"}
    {:else if columnKey === "actions"}
        <ActionButton
            {server}
            on:refresh={refreshClicked}
            on:connect={connectClicked}
            on:edit={editClicked}
            on:menu={menuClicked}
            on:remove={removeClicked}
        />
    {:else}
        <!-- Other columns -->
        {server.stats ? server.stats[columnKey] || "-" : "-"}
    {/if}
</div>
