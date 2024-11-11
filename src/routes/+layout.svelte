<script lang="ts">
    import Header from "../components/Header.svelte"
    import "../app.css"  
    import { onMount } from "svelte"
    import { initializeServerStore, initializeCloudAccountStore } from "$lib/stores/serverStore"
    import { userStore, initializeUserSettings } from "$lib/stores/userStore"; // Import the user store
    import type { PageData } from "./$types.js"

    export let data: PageData

    onMount(async () => {
        // Set the userID in the userStore        
        if (data.userID) {
            await initializeUserSettings(data.userID)
        }

        initializeCloudAccountStore(data.initialCloudAccounts || [])
        
        initializeServerStore(data.initialServers || [])

        initializeUserSettings(data.userID || "")

    })

    // Watch for changes in data.userID
    $: if (data.userID) {
        userStore.update(settings => ({ ...settings, userID: data.userID }));
    }

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
