<script lang="ts">
    import { Modal, Input, Label, Button } from "flowbite-svelte";
    import { createEventDispatcher } from "svelte";
    import type { RemoteServerConfig } from "$lib/types/types";
    import PasswordInput from "../components/PasswordInput.svelte"; 

    export let open: boolean;
    export let server: RemoteServerConfig;
    export let code: string;

    const dispatch = createEventDispatcher();

    function handleSave() {
        dispatch("save", server);
        open = false;
    }
</script>

<Modal title="Activation Details" bind:open>
    <div class="p-4 flex flex-col space-y-4">
        <p>Activation code: <strong>{code}</strong> Found!</p>

        <p>Adding database id: {server.id} to your account.</p>
        <div class="mt-4">
            <Label for="databaseName">Database Name</Label>
            <Input id="databaseName" bind:value={server.name} placeholder="Give this database a name" />
            <Label for="databaseName">Username</Label>
            <Input id="databaseName" bind:value={server.username} placeholder="Enter the username (optional)" />
            <Label for="databaseName">Password</Label>
            <PasswordInput id="databaseName" bind:value={server.password} placeholder="Enter password (optional)" />
        </div>
    </div>
    <div slot="footer" class="flex items-end w-full">
        <div class="grow"></div>
        <button class="lime-button" on:click={handleSave}>Add to Account</button>
    </div>
</Modal>