<!-- src/routes/add/+page.svelte -->
<script lang="ts">
    import EditServerPanel from "./EditServerPanel.svelte"
    import type { ServerConfig, ServerWithStats } from "$lib/types/types"
    import { Button, Modal, Accordion, AccordionItem } from "flowbite-svelte"
    import { updateServer, removeServer } from "$lib/stores/serverStore"

    export let server: ServerWithStats
    export let open: boolean

    // Create a new ServerConfig object, copying the original
    let editedConfig: ServerConfig = { ...server.config }

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

    const handleUpdate = async () => {
        await updateServer(editedConfig)
        open = false
    }
</script>

<Modal title="Edit Redis Instance" bind:open on:close={handleClose} size="xl">
    <EditServerPanel bind:server={editedConfig} />

    {#if server.stats}
        <Accordion>
            <AccordionItem open>
                <span slot="header">Statistics</span>
                <div class="px-4 py-5 sm:p-6">
                    <dl class="grid lg:grid-cols-3 grid-cols-2 gap-x-2 gap-y-4 ">
                        {#each Object.entries(server.stats) as [key, value]}
                            <div class="sm:col-span-1">
                                <dt class="text-sm font-medium overflow-hidden text-gray-500 dark:text-slate-100">
                                    {key}
                                </dt>
                                <dd class="mt-1 overflow-hidden text-sm text-gray-900 dark:text-white font-mono">
                                    {value}
                                </dd>
                            </div>
                        {/each}
                    </dl>
                </div>
            </AccordionItem>
        </Accordion>
    {/if}
    <svelte:fragment slot="footer">
        <div class="flex w-full space-x-2">
            <button class="red-outline-button" on:click={handleRemove}>Remove Instance</button>
            <div class="grow" />
            <button class="lime-button" on:click={handleUpdate}>Save</button>
        </div>
    </svelte:fragment>
</Modal>
