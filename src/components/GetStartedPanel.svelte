<!-- src/components/AddInstance.svelte -->
<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import { Card } from "flowbite-svelte"
    import AddDatabase from "../AddDatabase/AddDatabase.svelte"
    import { ServerOutline } from "flowbite-svelte-icons"

    const dispatch = createEventDispatcher()
    let addDatabaseModalOpen = false

    function addDatabase() {
        // Logic to open a modal or navigate to the add instance page
        addDatabaseModalOpen = true
        dispatch("openAddDatabaseModal")
    }
</script>

<Card size="md" class="shadow-none dark:bg-slate-700 dark:border-slate-300">
    <div class="flex flex-col items-center justify-start space-y-4">
        <h3 class="h3 text-2xl text-black font-bold dark:text-white flex">
            <ServerOutline class="w-8 h-8 mr-2" />
            Welcome to Redis Cloud Insight
        </h3>
        <p>
            Effortless control, real-time monitoring and seamless management for all your Redis databases
        </p>
        <h3 class="text-lg font-bold">Supported Platforms</h3>
        <ul class="font-mono">
            <li>
                Redis OSS
            </li>
            <li>
                Redis Cloud
            </li>
            <li>
                Redis Enterprise
            </li>
            <li>
                AWS Elasticache
            </li>
            <li>
                GCP Memorystore
            </li>
            <li>
                Azure Cache for Redis
            </li>
        </ul>
        <p>
            Get started by adding your Redis instance and experience the power
            of Redis Cloud Insight.
        </p>
        <button on:click={addDatabase} class="w-full lime-button">
            Add Database
        </button>
    </div>
</Card>

<AddDatabase bind:open={addDatabaseModalOpen} />
