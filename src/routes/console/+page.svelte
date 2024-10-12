<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { onMount, onDestroy } from "svelte"

    import FaMemory from "svelte-icons/fa/FaMemory.svelte"
    import FaMicrochip from "svelte-icons/fa/FaMicrochip.svelte"
    import FaUsers from "svelte-icons/fa/FaUsers.svelte"
    import FaTerminal from "svelte-icons/fa/FaTerminal.svelte"
    import FaCheckCircle from "svelte-icons/fa/FaCheckCircle.svelte"
    import StatCard from "../../components/StatCard.svelte"
    import InstanceTable from "../../components/InstanceTable/InstanceTable.svelte"
    import { refreshServer} from "$lib/stores/serverStore"
    import QuickStart from "./QuickStart.svelte"

    import {
        calculateTotalMemory,
        calculateTotalAvailableMemory,
        calculateTotalClients,
        calculateAverageCPUUtilization,
        calculateAvgCommands,
        calculateKeyspaceHitPercentage,
        calculateTotalKeyspaceHits,
        calculateTotalKeyspaceMisses,
        formatMemory,
    } from "$lib/redisInfo"

    import { servers } from "$lib/stores/serverStore"

    let loaded = false
    let quickStartModalOpen = false 

    onMount(() => {
        loaded = true
        // Start the interval when the component mounts
        interval = setInterval(() => {
            // loop through all servers and refresh stats
            $servers.forEach((server) => {
                refreshServer(server)
            })
        }, refreshInterval)

        if ($servers.length === 0) { 
            quickStartModalOpen = true
        }
    })

    // Set up an interval to refresh data every few seconds
    const refreshInterval = 5000 // Refresh every 5000 milliseconds (5 seconds)
    let interval: ReturnType<typeof setInterval>

    onDestroy(() => {
        // Clear the interval when the component is destroyed to prevent memory leaks
        clearInterval(interval)
    })
</script>

{#if loaded}
    {#if 1}
        <!-- Dashboard and InstanceTable Section -->
        <section class="flex flex-col gap-2 pb-10">
            <div class="grid grid-cols-3 gap-4 mb-3">
                <StatCard
                    title="Active Servers"
                    value={$servers.filter((s) => s.error == undefined).length}
                    icon={FaCheckCircle}
                    subtitle={`${$servers.filter((s) => s.error == undefined).length} / ${$servers.length} servers connected`}
                />

                <StatCard
                    title="Total Memory"
                    value={formatMemory(calculateTotalMemory($servers))}
                    icon={FaMemory}
                    current={calculateTotalMemory($servers)}
                    max={calculateTotalAvailableMemory($servers)}
                />

                <StatCard
                    title="Connected Clients"
                    value={calculateTotalClients($servers)}
                    icon={FaUsers}
                    subtitle="Total clients connected to all servers"
                />
                <StatCard
                    title="Average CPU Utilization"
                    value={calculateAverageCPUUtilization($servers)}
                    icon={FaMicrochip}
                    subtitle="Average CPU usage across all servers"
                    precision={2}
                    suffix="%"
                />
                <!-- <StatCard
                    title="Memory Fragmentation"
                    value={calculateAverageMemoryFragmentation($servers)}
                    icon={FaServer}
                    subtitle="Average fragmentation ratio"
                /> -->

                <StatCard
                    title="Avg. Commands Total"
                    value={calculateAvgCommands($servers)}
                    icon={FaTerminal}
                    subtitle="Average across all servers"
                />

                <StatCard
                    title="Keyspace Hit %"
                    value={calculateKeyspaceHitPercentage(
                        calculateTotalKeyspaceHits($servers),
                        calculateTotalKeyspaceMisses($servers)
                    )}
                    icon={FaCheckCircle}
                    subtitle="Overall keyspace hit rate across all servers"
                />
            </div>
            <!-- </AccordionItem> -->
            <!-- </Accordion> -->

            <InstanceTable />
        </section>
    {/if}
{:else if !loaded}
    <div class="flex justify-center items-center">
        <div
            class="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-blue-500 border-b-blue-500 border-l-blue-500 border-r-transparent rounded-full"
            role="status"
        >
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
{/if}

<QuickStart bind:open={quickStartModalOpen} />
