<script lang="ts">
    import { selectedColumns, availableColumns } from "$lib/stores/columnStore"
    import {
        servers,
        refreshServerStats,
        updateServer,
        removeServer,
    } from "$lib/stores/serverStore"
    import { type ServerWithStats } from "$lib/types/types"
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
    import AddServerDialog from "./AddServerDialog.svelte"
    import EditServerDialog from "./EditServerDialog.svelte"
    import { openRedisInsight } from "$lib/redisInfo"

    // Compute the visible columns based on selectedColumns
    $: visibleColumns = availableColumns.filter((column) =>
        $selectedColumns.has(column.key)
    )

    let columnsModalOpen = false
    let addInstanceModalOpen = false
    let editInstanceModalOpen: { [key: string]: boolean } = {}

    function handleUpdate(event: CustomEvent) {
        updateServer(event.detail)
    }

    function handleRemove(server: ServerWithStats) {
        removeServer(server.config.id)
    }
    function handleRowClicked(server: ServerWithStats) {
        //editInstanceModalOpen[server.config.id] = true
        openRedisInsight(server)
    }
    function handleRefresh(server: ServerWithStats) {
        refreshServerStats(server.config.id)
    }
    function handleEdit(server: ServerWithStats) {
        editInstanceModalOpen[server.config.id] = true
    }
</script>

<Card size="xl" padding="sm" class="shadow-none dark:bg-slate-600 dark:border-slate-200 dark:text-lime-500">
    <div class="flex mb-2 p-2">
        <caption
            class="text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-transparent"
        >
            Redis Instances
            <p class="text-sm font-normal text-gray-500 dark:text-gray-400">
                Manage your Redis Instances
            </p>
        </caption>
        <div class="grow"></div>
        <Button
            size="xs"
            color="none"
            on:click={() => (addInstanceModalOpen = true)}
            class="text-xs text-primary-500 px-2 py-0 flex items-center dark:hover:bg-lime-500 dark:hover:text-black hover:bg-primary-500 dark:text-lime-500 hover:text-white"
        >
            <PlusOutline class="w-4 h-4 me-1" />
            Add Instance
        </Button>
        <Button
            size="xs"
            color="none"
            class="text-xs text-primary-500 px-2 py-0 flex items-center dark:hover:bg-lime-500 dark:hover:text-black  hover:bg-primary-500 dark:text-lime-500 hover:text-white"
            on:click={() => (columnsModalOpen = true)}
        >
            <AdjustmentsHorizontalOutline class="w-4 h-4 me-1" />
            Customize
        </Button>
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
                <TableBodyRow
                    class="cursor-pointer group "
                    on:click={() => handleRowClicked(server)}
                >
                    {#each visibleColumns as column}
                        <TableBodyCell tdClass="px-5 py-2 dark:bg-slate-700 dark:group-hover:bg-slate-400 ">
                            <ServerCell
                                {server}
                                columnKey={column.key}
                                on:refresh={() => handleRefresh(server)}
                                on:edit={() => handleEdit(server)}
                                on:remove={() => handleRemove(server)}
                                
                            />
                        </TableBodyCell>
                    {/each}
                </TableBodyRow>

                <EditServerDialog
                    bind:open={editInstanceModalOpen[server.config.id]}
                    {server}
                    on:update={handleUpdate}
                    on:remove={() => handleRemove(server)}
                />
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
                        on:change={() =>
                            selectedColumns.toggleColumn(column.key)}
                    >
                    <span>{column.label}</span>
                    </Toggle>
                <!-- </label> -->
            {/each}
        </div>
    </div>
</Modal>

<AddServerDialog bind:open={addInstanceModalOpen} />
