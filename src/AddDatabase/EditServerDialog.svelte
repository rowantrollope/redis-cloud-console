<!-- src/routes/add/+page.svelte -->
<script lang="ts">
    import EditServerPanel from "./EditServerPanel.svelte"
    import type { ServerConfig, ServerWithStats } from "$lib/types/types"
    import { Modal} from "flowbite-svelte"
    import { updateServer, removeServer } from "$lib/stores/serverStore"
    import { slide } from 'svelte/transition';

    export let server: ServerWithStats
    export let open: boolean

    // Create a new ServerConfig object, copying the original
    let editedConfig: ServerConfig = { ...server.config }
    let showAll = false
    const handleRemove = async () => {
        if (
            confirm(
                `${server.config.name}\n\nAre you sure you want to remove this Redis Instance?`
            )
        ) {
            await removeServer(server.config.id)
            open = false
        }
    }

    const handleClose = () => {
        editedConfig = { ...server.config }
        open = false
    }

    const handleShowAll = () => {
        showAll = !showAll
    }

    const handleUpdate = async () => {
        await updateServer(editedConfig)
        open = false
    }
</script>

<Modal title="Database Details" bind:open on:close={handleClose} size="md">
    <EditServerPanel bind:server={editedConfig} stats={server.stats} />

    {#if server.stats}
        <div class="">
            <div class="flex items-center justify-center">
                <button
                    class=" text-blue-500 text-sm underline"
                    on:click={handleShowAll}
                >
                    {showAll ? "Show Less" : "Show All Statistics"}
                </button>
            </div>
            <h3 class="{showAll ? '' : 'hidden'} text-xs pt-2 pb-2 uppercase">Statistics</h3>
            <dl
                transition:slide
                class="{showAll ? '' : 'hidden'} bg-gray-50 flex flex-col space-y-2 divide-y rounded-md"
            >
                {#each Object.entries(server.stats) as [key, value]}
                    <div class="flex items-center justify-between p-2">
                        <dt class="grow text-black overflow-hidden">
                            {key}
                        </dt>
                        <dd class="font-mono text-gray-500">
                            {value}
                        </dd>
                    </div>
                {/each}
            </dl>
        </div>
    {/if}
    <svelte:fragment slot="footer">
        <div class="flex w-full space-x-2">
            <button class="red-outline-button" on:click={handleRemove}
                >Remove</button
            >
            <div class="grow" />
            <button class="lime-button" on:click={handleUpdate}>Save</button>
        </div>
    </svelte:fragment>
</Modal>
