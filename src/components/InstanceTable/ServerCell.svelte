<!-- components/ServerCell.svelte -->
<script lang="ts">
    import ActionButton from "./ActionButton.svelte"

    import StatusButton from "./StatusButton.svelte"
    import {
        type ServerWithStats,
        ServerState,
        ServerType,
    } from "$lib/types/types"
    import {
        getProvider,
        getRedisVersion,
        openRedisInsight,
    } from "$lib/redisInfo"
    import AnimatedNumber from "../AnimatedNumber.svelte"

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
    // Function to format the timestamp
    function formatDate(timestamp: number): string {
        const date = new Date(timestamp * 1000) // Convert Unix timestamp to milliseconds
        const now = new Date()

        const isToday = date.toDateString() === now.toDateString()
        const isYesterday =
            date.toDateString() ===
            new Date(now.setDate(now.getDate() - 1)).toDateString()

        if (isToday) {
            return "Today"
        } else if (isYesterday) {
            return "Yesterday"
        } else {
            return date.toLocaleDateString() // Customize the format as needed
        }
    }

    // ... existing code ...
    function formatTime(timestamp: number): string {
        const date = new Date(timestamp * 1000) // Convert Unix timestamp to milliseconds
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }) // Exclude seconds
    }
    function timeAgo(timestamp: number): string {
        const now = Date.now() / 1000 // Current time in seconds
        const secondsAgo = Math.floor(now - timestamp)

        const intervals = [
            { label: "week", seconds: 604800 },
            { label: "day", seconds: 86400 },
            { label: "hour", seconds: 3600 },
            { label: "minute", seconds: 60 },
            { label: "second", seconds: 1 },
        ]

        for (const interval of intervals) {
            const count = Math.floor(secondsAgo / interval.seconds)
            if (count >= 1) {
                return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`
            }
        }

        return "just now"
    }
</script>

<section class="text-sm font-normal">
    {#if columnKey === "name"}
        <button class="flex hover:underline font-semibold" on:click={connectClicked}>
            {server.config.name}
        </button>
    {:else if columnKey === "lastHeartbeat"}
        {#if server.stats?.timestamp}
            <span class="font-normal">
            {formatDate(server.stats?.timestamp)}
            </span>
            {formatTime(server.stats?.timestamp)}
        {/if}
    {:else if columnKey === "host"}
        <span class="font-mono max-w-36 text-xs overflow-ellipsis line-clamp-1">
            {#if server.config.type === ServerType.LOCAL}
                {server.config.host}:{server.config.port}
            {:else if server.config.type === ServerType.CLOUD}
                {server.config.host}
            {/if}
        </span>
    {:else if columnKey === "cpu"}
        <div class="flex space-x-2">
            <AnimatedNumber textStyle="font-semibold" value={server.stats?.used_cpu_sys} precision={2} />
            <span>%</span>
        </div>
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
        {#if server.stats?.total_commands_processed}
            <AnimatedNumber
                textStyle="font-semibold"
                value={server.stats?.total_commands_processed}
            />
        {:else}
            -
        {/if}
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
            {server}
            on:refresh={refreshClicked}
            on:connect={connectClicked}
            on:edit={editClicked}
            on:menu={menuClicked}
            on:remove={removeClicked}
        />
    {/if}
</section>
