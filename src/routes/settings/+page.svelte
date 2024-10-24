<script lang="ts">
    import { userStore } from "$lib/stores/userStore"
    import { onMount } from "svelte"
    import { get } from "svelte/store"
    import { Card } from "flowbite-svelte"
    import { DarkMode } from "flowbite-svelte"
    import SettingsRow from "../../components/SettingsRow.svelte" 
    import CloudAccounts from "./CloudAccounts.svelte"

    let userID = ""
    let refreshInterval = 30

    onMount(() => {
        userID = get(userStore).userID
    })

    async function handleSubmit() {
        // Update the userStore
        userStore.set({ userID })

        // Send the new userID to the server to update the cookie
        const response = await fetch("/api/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID }),
        })

        if (response.ok) {
            alert("User ID updated successfully")
            // Optionally, you can redirect or reload the page
            // location.reload();
        } else {
            const errorData = await response.json()
            alert(`Failed to update User ID: ${errorData.error}`)
        }
    }
</script>

<section class="flex flex-col w-full items-start justify-start p-4">
    <h1>Settings</h1>
    <p class="pb-5 dark:text-white">Update settings for the app</p>

    <div
        class="w-full flex flex-col m-auto space-y-4 items-center justify-center"
    >
        <Card class="card p-4 max-w-2xl">
            <h2 class="mb-4">Display</h2>
            <SettingsRow>
                <div slot="left">Dark Mode</div>
                <div slot="right"><DarkMode/></div>
            </SettingsRow>

        </Card>

        <Card class="card p-4 max-w-2xl">
            <h2>Cloud Accounts</h2>
            <p>Add your Redis Cloud account to connect your databases. </p>
            <CloudAccounts />
        </Card>

        <Card class="card p-4 w-full flex flex-col space-y-4 max-w-2xl ">
            <h2>General</h2>
            <form on:submit|preventDefault={handleSubmit} class="max-w-2xl">
                <SettingsRow>
                    <div slot="left">User ID (UUID)</div>
                    <div slot="right">
                        <input
                            class="border-none text-right w-96"
                            type="text"
                            id="userID"
                            bind:value={userID}
                            required
                        />
                    </div>
                </SettingsRow>
                <SettingsRow>
                    <div slot="left">Refresh Interval (seconds)</div>
                    <div slot="right">
                        <input
                            class="border-none text-right w-80"
                            type="text"
                            id="userID"
                            bind:value={refreshInterval}
                            required
                        />
                    </div>
                </SettingsRow>
                
                <div class="flex pt-4">
                    <div class="grow"></div>
                    <button type="submit" class="lime-button">Save</button>
                </div>
            </form>
        </Card>
    </div>
</section>
