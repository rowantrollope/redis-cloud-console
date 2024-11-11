<!-- src/components/CloudAccount/EditCloudAccountPanel.svelte -->
<script lang="ts">
    import { v4 as uuidv4 } from "uuid"
    import { addCloudAccount } from "$lib/stores/serverStore"
    import { Modal, Label, Input } from "flowbite-svelte"
    import type { RedisCloudAccount } from "$lib/types/types"
    import PasswordInput from "../PasswordInput.svelte"

    export let open: boolean
    let account: RedisCloudAccount = {
        id: uuidv4(),
        name: "",
        apiKey: "",
        accountKey: "",
    }

    function handleAdd() {
        addCloudAccount(account)
        open = false
    }
</script>

<Modal title="Add Redis Cloud Account" bind:open>
  <p>Add a Redis Cloud account to connect to your Redis Cloud account. You can find your API keys in the <a href="https://console.redislabs.com/account/api" target="_blank">Redis Cloud Console</a>.</p>
  <div class="flex flex-col space-y-4">
      <div>
            <Label for="accountName">Account Name</Label>
            <Input id="accountName" bind:value={account.name} placeholder="Enter the name of this account" required tabIndex="1"/>
        </div>
        <div>
            <Label for="accountKey">API Account Key</Label>
            <PasswordInput
                id="accountKey"
                bind:value={account.accountKey}
                placeholder="Enter the API Account Key"
                tabIndex="2"
            />
        </div>
        <div>
            <Label for="userApiKey">API User Key</Label>
            <PasswordInput
                id="userApiKey"
                bind:value={account.apiKey}
                placeholder="Enter the API User Key"
                tabIndex="3"
            />
        </div>
    </div>
    <div class="mt-4 flex justify-end space-x-2">

        <button class="lime-button" on:click={handleAdd}>Add Account</button>
    </div>
</Modal>
