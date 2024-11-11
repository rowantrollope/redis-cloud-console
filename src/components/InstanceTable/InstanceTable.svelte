<script lang="ts">
    import { selectedColumns, availableColumns } from "$lib/stores/columnStore"
    import { servers, removeServer } from "$lib/stores/serverStore"
    import { type ServerWithStats } from "$lib/types/types"
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Card,
        Modal,
        Toggle,
    } from "flowbite-svelte"
    import SettingsRow from "../SettingsRow.svelte"

    import {
        AdjustmentsHorizontalOutline,
        ArrowRightOutline,
        PlusOutline,
    } from "flowbite-svelte-icons"

    import ServerCell from "./ServerCell.svelte"
    import AddDatabase from "../../components/AddDatabase/AddDatabase.svelte"
    import ServerDrawer from "./ServerDrawer.svelte"
    import { openRedisInsight } from "$lib/redisInfo"
    // Compute the visible columns based on selectedColumns
    $: visibleColumns = availableColumns.filter((column) =>
        $selectedColumns.has(column.key)
    )

    let columnsModalOpen = false
    let addInstanceModalOpen = false
    let serverDrawerOpen: { [key: string]: boolean } = $servers.reduce(
        (acc: { [key: string]: boolean }, server) => {
            acc[server.config.id] = true
            return acc
        },
        {}
    )
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

<Card size="xl" padding="sm" class="card">
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
        {#if $servers.length > 0}
            <button
                on:click={() => (addInstanceModalOpen = true)}
                class="text-xs py-0 no-outline-button"
            >
                <PlusOutline class="w-4 h-4 me-1" />
                Add Database
            </button>
            <button
                id="customize"
                class="text-xs no-outline-button px-2 py-0"
                on:click={() => (columnsModalOpen = true)}
            >
                <AdjustmentsHorizontalOutline class="w-4 h-4 me-1" />
                Customize
            </button>
        {/if}
    </div>

    {#if $servers.length > 0}
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
                        class="cursor-pointer" 
                        on:click={() => handleMenu(server)}
                    >
                        {#each visibleColumns as column}
                            <TableBodyCell>
                                <ServerCell
                                    {server}
                                    columnKey={column.key}
                                    on:menu={() => handleMenu(server)}
                                />
                            </TableBodyCell>
                        {/each}
                    </TableBodyRow>
                {/each}
            </TableBody>
        </Table>
    {:else}
        <div class="flex flex-col items-center justify-center p-4 text-center">
            <p class="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Welcome to Your Redis Dashboard
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                This is where you'll manage all your Redis databases. Get
                started by adding your first database connection - it only takes
                a minute to set up!
            </p>
        </div>
        <div class="flex items-center justify-center p-8 space-x-4">
            <button
                class="lime-button"
                on:click={() => (addInstanceModalOpen = true)}
            >
                <PlusOutline class="w-4 h-4 me-1" />
                Add Database
            </button>
            <button
                class="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                on:click={() => (addInstanceModalOpen = true)}
            >
                See how it works
                <ArrowRightOutline class="w-6 h-6 ml-1" />
            </button>
        </div>
    {/if}
</Card>

<Modal title="Customize" bind:open={columnsModalOpen} autoclose size="sm">
    <div class="flex justify-center space-x-4">
        <div class="flex flex-col space-y-1 w-full">
            <p class="font-normal text-gray-500 dark:text-gray-400 p-2">
                Select visible columns
            </p>
            {#each availableColumns as column}
                <!-- <label class="flex items-center space-x-2" for={column.key}> -->

                <SettingsRow>
                    <div slot="left">
                        <div>
                            {column.longName}
                        </div>
                    </div>
                    <div slot="right">
                        <Toggle
                            checked={$selectedColumns.has(column.key)}
                            id={column.key}
                            on:change={() =>
                                selectedColumns.toggleColumn(column.key)}
                        ></Toggle>
                    </div>
                </SettingsRow>

                <!-- </label> -->
            {/each}
        </div>
    </div>
</Modal>

<AddDatabase bind:open={addInstanceModalOpen} />
{#each $servers as server}
    <ServerDrawer
        bind:hidden={serverDrawerOpen[server.config.id]}
        {server}
        on:connect={() => handleConnect(server)}
        on:remove={() => handleRemove(server)}
    />
{/each}
