<script lang="ts">
    import { cloudAccounts, removeCloudAccount } from "$lib/stores/serverStore"
    import EditCloudAccountPanel from "./EditCloudAccountPanel.svelte"
    import { Modal, Listgroup, ListgroupItem } from "flowbite-svelte"
    import { servers } from "$lib/stores/serverStore"
    import { type CloudServerConfig } from "$lib/types/types"
    let addAccountModalOpen = false

    function handleAddAccount() {
        addAccountModalOpen = true
    }
    // Type guard function
    function isCloudServerConfig(config: any): config is CloudServerConfig {
        return config && typeof config.cloudAccountId === "string"
    }
</script>

<div class="mb-4">
    <p>
        Connect your Redis Cloud account to add your <strong>Redis Cloud</strong
        > databases.
    </p>
    <button class="lime-button mt-4" on:click={handleAddAccount}>
        Add Redis Cloud Account
    </button>
</div>

<!-- List existing accounts -->
{#if $cloudAccounts.length > 0}
    <div class="mb-4">Connected Accounts</div>
    <Listgroup>
        {#each $cloudAccounts as account (account.id)}
            <ListgroupItem
                class="p-3 hover:bg-slate-500 hover:text-lime-500 group"
            >
                <div class="flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-lg">{account.name}</h3>
                    <p class="text-sm text-gray-500 group-hover:text-lime-200">
                        Redis Cloud Account
                    </p>
                </div>
                <button
                    class="red-outline-button"
                    on:click={() => removeCloudAccount(account.id)}
                >
                    Remove
                </button>
                </div>
                <!-- show all the databases for this account --><div class="p-4">
                <h3 class="border-t py-2">Databases</h3>
                {#each $servers as server}
                    {#if isCloudServerConfig(server.config) && server.config.cloudAccountId === account.id}
                    <div class="flex space-x-2">    
                    <div class="font-bold">{server.config.name}</div>
                    <div class="font-thin">Host: {server.config.host}</div>
                    <div class="font-thin">Port: {server.config.port}</div>
                    </div>
                    {/if}
                {/each}
            </div>
            </ListgroupItem>
            
        {/each}
    </Listgroup>
{/if}
<!-- Add Account Modal -->
{#if addAccountModalOpen}
    <EditCloudAccountPanel bind:open={addAccountModalOpen} />
{/if}
