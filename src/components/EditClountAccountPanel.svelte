<!-- src/components/CloudAccount/AddCloudAccount.svelte -->
<script lang="ts">
    import { v4 as uuidv4 } from "uuid"
    import { addCloudAccount } from "$lib/stores/cloudAccountStore"
    import { Modal, Label, Input, Button } from "flowbite-svelte"

    let open = false
    let accountName = ""
    let accountKey = ""
    let apiKey = ""

    async function handleAdd() {
        await addCloudAccount({
            id: uuidv4(),
            name: accountName,
            accountKey,
            apiKey,
        })
        // Reset fields and close modal
        accountName = ""
        accountKey = ""
        apiKey = ""
        open = false
    }
</script>

<div class="flex flex-col space-y-4">
    <div>
        <Label for="accountName">Account Name</Label>
        <Input id="accountName" bind:value={accountName} required />
    </div>
    <div>
        <Label for="accountKey">Account Key</Label>
        <Input id="accountKey" bind:value={accountKey} required />
    </div>
    <div>
        <Label for="apiKey">User API Key</Label>
        <Input id="apiKey" bind:value={apiKey} required />
    </div>
</div>
<div class="mt-4 flex justify-end space-x-2">
    <Button on:click={() => (open = false)}>Cancel</Button>
    <Button on:click={handleAdd}>Add Account</Button>
</div>
