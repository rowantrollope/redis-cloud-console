<!-- src/components/AddInstance.svelte -->
<script lang="ts">
	import { activationClaim } from '$lib/services/redisCloudServerService';
    import { createEventDispatcher } from "svelte"
    import { Card } from "flowbite-svelte"
    import AddDatabase from "../AddDatabase/AddDatabase.svelte"

    const dispatch = createEventDispatcher()
    let addDatabaseModalOpen = false

    function addDatabase() {
        addDatabaseModalOpen = true
        dispatch("openAddDatabaseModal")
    }
</script>

<section class="flex flex-col space-y-4">
    <div class="-m-4 px-8 py-14 bg-slate-800 text-white">
        <div class="text-white text-8xl sm:text-9xl trailers-text uppercase text-center">
            Manage Open Source Redis<br/>with <span class="text-lime-400">Redis Cloud Insight</span>
        </div>
        <p class="text-center text-2xl">
            Redis Cloud Insight lets you monitor and manage
            your Redis databases, whether they are on Redis Cloud, Redis OSS or
            Redis Enterprise.
        </p>
    </div>
    <div class="hidden -m-4 py-4 justify-center bg-white text-black space-x-4">
        <div>
            Amazon
        </div>
        <div>
            Google Cloud
        </div>
        <div>   
            Azure
        </div>
        <div>
            Redis Cloud
        </div>
        <div>
            Redis Enterprise
        </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 pt-8">
        <Card
            size="md"
            class="card hover:bg-slate-500 hover:text-lime-500 group p-4"
        >
            <div
                class="px-4 flex flex-col items-center justify-start space-y-4 h-full"
            >
                <h1 class="card-title  group-hover:text-white">Step 1</h1>
                <h2 class="group-hover:text-white card-subtitle">
                    Download Redis
                </h2>
                <p class="grow">
                    Download and install Redis to get started with your database
                    management.
                </p>
                <a
                    href="/download"
                    class="w-full lime-button group-hover:lime-outline-button"
                >
                    Download
                </a>
            </div>
        </Card>

        <Card
            size="md"
            class="card hover:bg-slate-500 hover:text-lime-500 group"
        >
            <div
                class="px-4 flex flex-col items-center justify-start space-y-4 h-full"
            >
                <h1 class="card-title group-hover:text-white">Step 2</h1>
                <h2 class="group-hover:text-white card-subtitle">
                    Connect Your Redis Server or Add an existing server
                </h2>
                <p class="grow">
                    Already running? Activate your Redis instance with an activation code OR add an existing server 
                </p>
                <button on:click={addDatabase} class="w-full lime-button">
                    Connect
                </button>
            </div>
        </Card>

        <Card
            size="md"
            class="card  hover:bg-slate-500 hover:text-lime-500 group"
        >
            <div
                class="px-4 flex flex-col items-center justify-start space-y-4 h-full"
            >
                <h1 class="card-title group-hover:text-white">Step 3</h1>
                <h2 class="card-subtitle group-hover:text-white">
                    Manage from the Redis Cloud Insight Console
                </h2>
                <p class="grow">
                    Manage your Redis databases seamlessly from the cloud.
                </p>
                <a href="/console" class="w-full lime-button"> Manage </a>
            </div>
        </Card>
    </div>
</section>

<AddDatabase bind:open={addDatabaseModalOpen} />

<style>
    .card-start {
        @apply hover:bg-slate-500 hover:text-lime-500;
    }
    .card-title { 
        @apply -mt-2 pb-2 text-2xl border-b border-slate-500 w-full;
    }
    .card-subtitle {
        @apply font-normal text-center;
    }
</style>
