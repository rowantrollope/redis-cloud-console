<script lang="ts">
    import { selectedColumns, availableColumns } from "$lib/stores/columnStore"
    import {
        servers,
        refreshServerStats,
        updateServer,
        removeServer,
    } from "$lib/stores/serverStore"
    import { type ServerWithStats, DatabaseType } from "$lib/types/types"
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Card,
        Button,
        Modal,
        Toggle,
    } from "flowbite-svelte"

    import {
        AdjustmentsHorizontalOutline,
        PlusOutline,
    } from "flowbite-svelte-icons"

    import ServerCell from "./ServerCell.svelte"
    import RemoteServerCell from "./RemoteServerCell.svelte"
    import AddDatabase from "../../AddDatabase/AddDatabase.svelte"
    import ServerDrawer from "./ServerDrawer.svelte"
    import { openRedisInsight } from "$lib/redisInfo"
    // Compute the visible columns based on selectedColumns
    $: visibleColumns = availableColumns.filter((column) =>
        $selectedColumns.has(column.key)
    )

    let columnsModalOpen = false
    let addInstanceModalOpen = false
    let serverDrawerOpen: { [key: string]: boolean } = $servers.reduce((acc: { [key: string]: boolean }, server) => {
        acc[server.config.id] = true;
        return acc;
    }, {});
    
    function handleConnect(server: ServerWithStats) {
        console.log("handleConnect", server)
        openRedisInsight(server)
    }

    function handleRemove(server: ServerWithStats) {
        removeServer(server.config.id)
    }

    function handleMenu(server: ServerWithStats) {
        console.log("handleMenu", server.config)
        serverDrawerOpen[server.config.id] = false
    }
</script>

<Card
    size="xl"
    padding="sm"
    class="shadow-none dark:bg-slate-600 dark:border-slate-200 dark:text-lime-500"
>
    <div class="flex mb-2 p-2">
        <caption
            class="text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-transparent"
        >
            Redis Databases
            <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                Manage your Redis Databases
            </p>
        </caption>
        <div class="grow"></div>
        <button
            on:click={() => (addInstanceModalOpen = true)}
            class="text-xs py-0 no-outline-button"
        >
            <PlusOutline class="w-4 h-4 me-1" />
            Add Database
        </button>
        <button
            class="text-xs no-outline-button px-2 py-0"
            on:click={() => (columnsModalOpen = true)}
        >
            <AdjustmentsHorizontalOutline class="w-4 h-4 me-1" />
            Customize
        </button>
    </div>

    <Table striped hoverable>
        <TableHead>
            {#each visibleColumns as column}
                <TableHeadCell padding="px-5 py-2">
                    <span class={column.key == "actions" ? "sr-only" : ""}>
                        {column.label}
                    </span>
                </TableHeadCell>
            {/each}
        </TableHead>
        <TableBody>
            {#each $servers as server}
                <TableBodyRow>
                    {#each visibleColumns as column}
                        <TableBodyCell>
                            <!-- Use different components or logic based on server type -->
                            {#if server.config.type === DatabaseType.REMOTE}
                                <RemoteServerCell {server} columnKey={column.key} on:menu={() => handleMenu(server)} />
                            {:else}
                                <ServerCell {server} columnKey={column.key} on:menu={() => handleMenu(server)} />
                            {/if}
                        </TableBodyCell>
                    {/each}
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</Card>

<Modal title="Customize Columns" bind:open={columnsModalOpen} autoclose>
    <div class="flex justify-center">
        <div class="gap-4 grid grid-cols-3">
            {#each availableColumns as column}
                <!-- <label class="flex items-center space-x-2" for={column.key}> -->
                <Toggle
                    checked={$selectedColumns.has(column.key)}
                    id={column.key}
                    on:change={() => selectedColumns.toggleColumn(column.key)}
                >
                    <span>{column.label}</span>
                </Toggle>
                <!-- </label> -->
            {/each}
        </div>
    </div>
</Modal>

<AddDatabase bind:open={addInstanceModalOpen} />
{#each $servers as server}
    <ServerDrawer 
        bind:hidden={serverDrawerOpen[server.config.id]} 
        server={server} 
        on:connect={() => handleConnect(server)}
        on:remove={() => handleRemove(server)}
    />
{/each}
