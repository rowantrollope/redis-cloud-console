<script lang="ts">
    import Header from "../components/Header.svelte"
    import "../app.css"  
    import { onMount } from "svelte"
    import { initializeServerStore, initializeCloudAccountStore } from "$lib/stores/serverStore"
    import type { ServerConfig, RedisCloudAccount } from "$lib/types/types"
    import { userStore } from "$lib/stores/userStore"; // Import the user store
    
    export let data: {
        userID: string
        initialServers: ServerConfig[]
        initialCloudAccounts: RedisCloudAccount[]
    }

    onMount(async () => {
        // Set the userID in the userStore
        userStore.set({ userID: data.userID });

        console.log(`Initializing stores for user: ${data.userID}`)

        initializeServerStore(data.initialServers)
        initializeCloudAccountStore(data.initialCloudAccounts)


    })
</script>

<div class="bg-gray-50 dark:bg-slate-800 min-h-screen">

    <Header />

    <main>
        <slot />
    </main>

    <!-- <Footer/> -->
    
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
    }
</style>
