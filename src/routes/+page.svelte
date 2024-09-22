<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { onMount } from "svelte"

    import FaServer from "svelte-icons/fa/FaServer.svelte"
    import FaMemory from "svelte-icons/fa/FaMemory.svelte"
    import FaUsers from "svelte-icons/fa/FaUsers.svelte"
    import FaTerminal from "svelte-icons/fa/FaTerminal.svelte"
    import FaCheckCircle from "svelte-icons/fa/FaCheckCircle.svelte"
    import StatCard from "../components/StatCard.svelte"
    import InstanceTable from "../components/InstanceTable/InstanceTable.svelte"
    import { Accordion, AccordionItem, Card } from "flowbite-svelte"

    import {
        calculateTotalMemory,
        calculateTotalAvailableMemory,
        calculateTotalClients,
        calculateAverageMemoryFragmentation,
        calculateAvgCommands,
        calculateKeyspaceHitPercentage,
        calculateTotalKeyspaceHits,
        calculateTotalKeyspaceMisses,
        formatMemory,
    } from "$lib/redisInfo"
    import { ServerOutline } from "flowbite-svelte-icons"

    import { initializeServers, servers } from "$lib/stores/serverStore"
    import type { ServerConfig } from "$lib/types/types"

    // Import the AddInstance component or the action to open the add instance modal
    import AddInstance from "../components/AddInstance.svelte"

    export let data: {
        userID: string
        initialServers: ServerConfig[]
    }

    onMount(() => {
        console.log(
            `data.initialServers for user: ${data.userID}`,
            data.initialServers
        )
        initializeServers(data.initialServers)
    })
</script>

{#if data.initialServers.length > 0}
    <!-- Dashboard and InstanceTable Section -->
    <section class="flex flex-col gap-2">
        <Accordion flush={true}>
            <AccordionItem
                open
                class="p-0"
                paddingFlush="py-4 mb-2"
                textFlushOpen="text-slate-500 dark:text-white font-mono"
                textFlushDefault="font-mono"
            >
                <span slot="header">Dashboard</span>
                <div class="grid grid-cols-3 gap-4">
                    <StatCard
                        title="Active Servers"
                        value={$servers.filter((s) => s.error == undefined)
                            .length}
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
                        title="Total Connected Clients"
                        value={calculateTotalClients($servers)}
                        icon={FaUsers}
                        subtitle="+10% from last month"
                    />

                    <StatCard
                        title="Memory Fragmentation"
                        value={calculateAverageMemoryFragmentation($servers)}
                        icon={FaServer}
                        subtitle="Average fragmentation ratio"
                    />

                    <StatCard
                        title="Avg. Commands/sec"
                        value={calculateAvgCommands($servers)}
                        icon={FaTerminal}
                        subtitle="-22% from last month"
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
            </AccordionItem>
        </Accordion>

        <InstanceTable />
    </section>
{:else}
    <!-- Intro Panel Section -->
    <Card size="md" class="shadow-none dark:bg-slate-700 dark:border-slate-300">
        <div class="flex flex-col items-center space-y-4">
            <h3 class="h3 text-2xl text-black font-bold dark:text-white flex">
                <ServerOutline class="w-8 h-8 mr-2" />
                Welcome to Redis Cloud Insight
            </h3>
            <p class="mb-6">Redis Cloud Insight allows you to easily manage, monitor, and work with your Redis databases. Get started by adding your first instance and experience the power of Redis Cloud Insight.</p>
            <AddInstance class="w-full" />
        </div>
    </Card>
{/if}
