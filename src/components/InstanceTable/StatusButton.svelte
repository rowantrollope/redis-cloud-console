<script lang="ts">
    import { type ServerWithStats, ServerState } from "$lib/types/types"
    import { Badge, Spinner } from "flowbite-svelte"
    import { createEventDispatcher } from "svelte"
    import { ServerType } from "$lib/types/types"
    export let server: ServerWithStats

    
    $: statusColor =
        server.state === ServerState.SUCCESS
            ? "bg-transparent text-black dark:bg-transparent dark:text-white" // CONNECTED
            : server.state === ServerState.ERROR
              ? "bg-lime-200 dark:bg-transparent dark:text-white text-slate-500" // ERROR
              : "bg-yellow-200" // NO CONNECTION
    $: indicatorColor =
        server.state === ServerState.SUCCESS
            ? "bg-lime-500 dark:bg-lime-500 border border-lime-700 dark:border-lime-500" // CONNECTED
            : server.state === ServerState.ERROR
              ? "bg-red-500 dark:bg-primary-600" // ERROR
              : "bg-yellow-500" // NO CONNECTED

    $: altStatusColor =
        server.state === ServerState.SUCCESS
            ? "bg-slate-500 text-white dark:bg-transparent dark:text-white" // CONNECTED
            : server.state === ServerState.ERROR
              ? "bg-lime-200 dark:bg-transparent dark:text-white text-slate-500" // ERROR
              : "bg-yellow-200" // NO CONNECTION
    $: altIndicatorColor =
        server.state === ServerState.SUCCESS
            ? "bg-lime-400 dark:bg-lime-500" // CONNECTED
            : server.state === ServerState.ERROR
              ? "bg-lime-500 dark:bg-primary-600" // ERROR
              : "bg-yellow-500" // NO CONNECTED

    const dispatch = createEventDispatcher()

    function refreshClicked() {
        dispatch("refresh")
    }
</script>

<button on:click={refreshClicked} class="w-16">
    {#if server.config.type === ServerType.REMOTE}
        {#if server.config.status === "RUNNING" && server.state === ServerState.SUCCESS}
            <Badge class="rounded py-0.5 bg-transparent text-black dark:bg-transparent dark:text-white">
                <span class="rounded-full mr-1 w-3 h-3 bg-lime-500 dark:bg-lime-500"></span>
                Running
            </Badge>
        {:else if server.state === ServerState.ERROR}
            <Badge class="rounded px-2 py-0.5">
                <span class="rounded-full mr-1 w-3 h-3 bg-red-500"></span>
                Can't connect
            </Badge>

        {:else if server.config.status === "OFFLINE"}
            <Badge class="rounded px-2 py-0.5">
                <span class="rounded-full mr-1 w-3 h-3 bg-red-500"></span>
                Offline
            </Badge>
        {:else if server.config.status === "AGENT UNREACHABLE"}
            <Badge class="rounded px-2 py-0.5">
                <span class="rounded-full mr-1 w-3 h-3 bg-red-500"></span>
                Agent Offline
            </Badge>
        {/if}
    {:else}
        {#if server.state === ServerState.CONNECTING}
            <Badge class="rounded py-0.5 bg-transparent text-black dark:bg-transparent dark:text-white">
                <span class="rounded-full mr-1 w-3 h-3 bg-gray-300 dark:bg-lime-500"></span>
                Connecting
            </Badge>
        {:else}
            <Badge class="rounded px-2.5 py-0.5 {statusColor}">
                <span class="rounded-full mr-1 w-3 h-3 {indicatorColor}"></span>
                {server.state === ServerState.SUCCESS ? "Running" : "Offline"}
            </Badge>
        {/if}
    {/if}
</button>
