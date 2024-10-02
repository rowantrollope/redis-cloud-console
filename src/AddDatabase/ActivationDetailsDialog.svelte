<script lang="ts">
    import { Modal, Input, Label, Button } from "flowbite-svelte";
    import { createEventDispatcher } from "svelte";
    import type { RemoteServerConfig } from "$lib/types/types";

    export let open: boolean;
    export let server: RemoteServerConfig;

    const dispatch = createEventDispatcher();

    function handleSave() {
        dispatch("save", server);
        open = false;
    }
</script>

<Modal title="Activation Details" bind:open>
    <div class="p-4">
        <p><strong>Database ID:</strong> {server.databaseUUID}</p>
        <div class="mt-4">
            <Label for="databaseName">Database Name</Label>
            <Input id="databaseName" bind:value={server.name} placeholder="Give this database a name" />
        </div>
    </div>
    <div slot="footer" class="flex justify-end">
        <Button on:click={handleSave}>Save</Button>
    </div>
</Modal>