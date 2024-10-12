<!-- src/components/AddInstance.svelte -->
<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import { Modal } from "flowbite-svelte"
    import AddDatabase from "../../AddDatabase/AddDatabase.svelte"

    export let open = false

    const dispatch = createEventDispatcher()
    let addDatabaseModalOpen = false

    function addDatabase() {
        // Logic to open a modal or navigate to the add instance page
        open = false
        addDatabaseModalOpen = true
        dispatch("openAddDatabaseModal")
    }
</script>

<Modal title="Getting Started" bind:open>
    <div class="flex flex-col items-center justify-start space-y-4">
        <h1>Add your Redis Databases</h1>
        <p>
            Effortless control, real-time monitoring and seamless management for
            all your Redis databases
        </p>
        <h3 class="text-lg font-bold">Supported Platforms</h3>
        <ul class="font-mono">
            <li>Redis OSS</li>
            <li>Redis Cloud</li>
            <li>Redis Enterprise</li>
            <li>AWS Elasticache</li>
            <li>GCP Memorystore</li>
            <li>Azure Cache for Redis</li>
        </ul>
        <p>
            Get started by adding your Redis instance and experience the power
            of Redis Cloud Insight.
        </p>
    </div>
    <div slot="footer" class="flex items-end w-full">
        <button on:click={addDatabase} class="w-full lime-button">
            Add Database
        </button>
    </div>
</Modal>

<AddDatabase bind:open={addDatabaseModalOpen} />
