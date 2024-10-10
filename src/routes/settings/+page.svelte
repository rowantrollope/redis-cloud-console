<script lang="ts">
    import { userStore } from "$lib/stores/userStore"
    import { onMount } from "svelte"
    import { get } from "svelte/store"
    import { Input } from "flowbite-svelte"

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
    <h2 class="text-2xl font-bold text-center mb-2">Settings</h2>
    <p >
        Update settings for the app
    </p>
    <form on:submit|preventDefault={handleSubmit} class="p-4 w-full flex flex-col space-y-4">
        
        <div>
            <label for="userID" class="block mb-2 text-sm font-medium text-gray-600">User ID (UUID)</label>
            <Input type="text" id="userID" bind:value={userID} required />
        </div>

        <div>
            <label for="userID" class="block mb-2 text-sm font-medium text-gray-600">Refresh Interval (seconds)</label>
            <Input class="" type="text" id="userID" bind:value={refreshInterval} required />
        </div>
        <div class="flex pt-4">
            <div class="grow"></div>
            <button type="submit" class="lime-button">Save</button>
        </div>
    </form>
</section>
