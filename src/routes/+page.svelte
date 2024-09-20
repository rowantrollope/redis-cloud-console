<!-- src/routes/+page.svelte -->
<script lang="ts">
    import type { PageData } from "./$types"
    import { onMount } from "svelte"

    import FaServer from "svelte-icons/fa/FaServer.svelte"
    import FaMemory from "svelte-icons/fa/FaMemory.svelte"
    import FaUsers from "svelte-icons/fa/FaUsers.svelte"
    import FaTerminal from "svelte-icons/fa/FaTerminal.svelte"
    import FaCheckCircle from "svelte-icons/fa/FaCheckCircle.svelte"
    import StatCard from "../components/StatCard.svelte"
    import InstanceTable from "../components/InstanceTable/InstanceTable.svelte"
    import { Spinner, Accordion, AccordionItem } from "flowbite-svelte"

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
    import { writable } from "svelte/store"
    import { ServerState } from "$lib/types/types"
    import { initializeServers, servers } from "$lib/stores/serverStore"

    export let data: {
        initialServers: ServerConfigs[]
    }

    onMount(() => {
        initializeServers(data.initialServers)
    })
</script>

<section class="flex flex-col gap-2">
    <Accordion flush={true}>
        <AccordionItem open class="p-0" paddingFlush="py-4 mb-2" textFlushOpen="text-slate-500 dark:text-white font-mono" textFlushDefault="font-mono" >
            <span slot="header">Dashboard</span>
            <div class="grid grid-cols-3 gap-4">
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
