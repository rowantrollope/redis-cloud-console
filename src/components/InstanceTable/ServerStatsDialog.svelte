<script lang="ts">
    import type { ServerWithStats } from "$lib/types/types"
    import { Modal, Accordion, AccordionItem } from "flowbite-svelte"

    export let server: ServerWithStats
    export let open: boolean

</script>

<Modal title="Redis Instance - Stats" bind:open size="xl">

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
</Modal>
