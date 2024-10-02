<!-- components/ServerCell.svelte -->
<script lang="ts">
  import ActionButton from './ActionButton.svelte';

    import StatusButton from "./StatusButton.svelte"
    import { type ServerWithStats, ServerState, DatabaseType } from "$lib/types/types"
    import {
        getProvider,
        getRedisVersion,
        openRedisInsight,
    } from "$lib/redisInfo"

    import { calculateKeyspaceHitPercentage } from "$lib/redisInfo"
    import { createEventDispatcher } from "svelte"

    export let server: ServerWithStats
    export let columnKey: string

    const dispatch = createEventDispatcher()

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

<section class="text-sm">
    {#if columnKey === "name"}
        <button class="flex hover:underline" on:click={connectClicked}>
            {server.config.name}
        </button>
    {:else if columnKey === "host"}
        <span class="font-mono max-w-36 text-xs overflow-ellipsis line-clamp-1">
            {#if server.config.type === DatabaseType.LOCAL}
                {server.config.host}:{server.config.port}
            {:else if server.config.type === DatabaseType.CLOUD}
                {server.config.host}
            {/if}
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
        <ActionButton 
            server={server}
            on:refresh={refreshClicked}
            on:connect={connectClicked}
            on:edit={editClicked}
            on:menu={menuClicked}
            on:remove={removeClicked}
        />
    {/if}
</section>
