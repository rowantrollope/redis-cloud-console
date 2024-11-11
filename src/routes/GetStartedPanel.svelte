<!-- src/components/AddInstance.svelte -->
<script lang="ts">
    import { createEventDispatcher } from "svelte"
    import { Card } from "flowbite-svelte"
    import AddDatabase from "../components/AddDatabase/AddDatabase.svelte"
    import { goto } from "$app/navigation"
    import { APP_NAME } from "$lib/constants"
    import { ChevronRightOutline } from "flowbite-svelte-icons"

    const dispatch = createEventDispatcher()
    let addDatabaseModalOpen = false

    function addDatabase() {
        addDatabaseModalOpen = true
        dispatch("openAddDatabaseModal")
    }
</script>

<section class="flex flex-col space-y-4">
    <div class="-m-4 px-8 pt-14 bg-slate-800 text-white">
        <div class="text-white py-14 tailerslarge trailers-text uppercase text-center">
            Your app is about to get faster
        </div>

        <!-- <div class="text-white text-8xl sm:text-9xl trailers-text uppercase text-center">
            Manage Open Source Redis<br/>with <span class="text-lime-400">{APP_NAME} </span>
        </div> -->
        <p class="text-center text-2xl">
            <span class="text-lime-400">{APP_NAME}</span> lets you monitor and manage Redis Cloud, Redis OSS or Redis Enterprise.
        </p>
        <div class="flex justify-center space-x-8 p-12 text-xl">
            <a href="/console"class="lime-button">
                <span class="px-4">
                    Start Building
                </span>
            </a>
            <button class="no-outline-button">
                <span class="text-white hover:text-black">
                    Get a demo
                </span>
                <ChevronRightOutline class="w-6 h-6 text-white" />
            </button>
        </div>
    </div>
    <div class="-mx-4 pb-12 justify-center bg-slate-800 text-black flex space-x-12 items-center">
        <img src="/Logo01.svg" class="h-12" alt="Amazon Web Services"/>
        <img src="/Logo02.svg" class="h-8" alt="Google Cloud"/>
        <img src="/Logo03.svg" class="h-10" alt="Microsoft Azure"/>
    </div>
    <div class="flex flex-col space-y-4 items-center justify-center p-8">
        <h1 class="text-5xl">
            Why Redis OneCloud
        </h1>
        <p class="text-xl">Manage all redis instances across OSS and all cloud providers</p>
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
                    Manage from the Console
                </h2>
                <p class="grow">
                    Manage your Redis databases seamlessly from the cloud.
                </p>
                <a href="/console" class="w-full lime-button"> Manage </a>
            </div>
        </Card>
    </div>
</section>

<AddDatabase bind:open={addDatabaseModalOpen} on:close={() => goto("/console")}/>

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
    .tailerslarge {
        font-size: 12rem;
        line-height: .8;
    }
</style>
