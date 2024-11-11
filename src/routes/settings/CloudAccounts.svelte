<script lang="ts">
    import { cloudAccounts, removeCloudAccount } from "$lib/stores/serverStore"
    import { servers } from "$lib/stores/serverStore"
    let addAccountModalOpen = false
    import SettingsRow from "../../components/SettingsRow.svelte"
    import EditCloudAccountPanel from "../../components/CloudAccount/EditCloudAccountPanel.svelte"
    import { type ServerConfig } from "$lib/types/types"

    function handleAddAccount() {
        addAccountModalOpen = true
    }
    // Type guard function
    function isCloudServerConfig(config: any): config is ServerConfig {
        return config && typeof config.cloudAccountId === "string"
    }
</script>

<div class="flex items-center w-full">
    <div class="grow"></div>
    <button class="lime-button my-2" on:click={handleAddAccount}
        >Add Redis Cloud Account</button
    >
    <div class="grow"></div>
</div>

<!-- List existing accounts -->
{#if $cloudAccounts.length > 0}
    {#each $cloudAccounts as account (account.id)}
        <div class="border  my-2">
            <SettingsRow>
                <div slot="left" class="text-black dark:text-white font-bold font-mono">{account.name}</div>
                <div slot="right" class="flex space-x-2">
                    <button
                        class="outline-button"
                        on:click={() => removeCloudAccount(account.id)}
                    >
                        Edit
                    </button>
                    <button
                        class="red-outline-button"
                        on:click={() => removeCloudAccount(account.id)}
                    >
                        Remove
                    </button>
                </div>
            </SettingsRow>

            <!-- show all the databases for this account -->
            {#if $servers.length > 0}
                <div class="p-4">
                    <h3 class="py-2">Databases in {account.name}:</h3>
                    <table>
                        <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left">Host</th>
                            <th class="text-left">Port</th>
                        </tr>
                    {#each $servers as server}
                        {#if isCloudServerConfig(server.config) && server.config.cloudAccountId === account.id}
                            <tr>
                                <td class="font-bold">
                                    {server.config.name}
                                </td>
                                <td class="font-thin">
                                    {server.config.host}
                                </td>
                                <td class="font-thin">
                                    {server.config.port}
                                </td>
                            </tr>
                        {/if}
                    {/each}
                </div>
            {:else}
                <div class="p-4">No databases found</div>
            {/if}
        </div>
    {/each}
{/if}
<!-- Add Account Modal -->
{#if addAccountModalOpen}
    <EditCloudAccountPanel bind:open={addAccountModalOpen} />
{/if}
