<!-- src/routes/add/+page.svelte -->
<script lang="ts">
    import EditServerPanel from "./EditServerPanel.svelte"
    import { v4 as uuidv4 } from "uuid"
    import type { ServerConfig } from "$lib/types/types"
    import { Button, Modal } from "flowbite-svelte"
    import { addServer } from "$lib/stores/serverStore"
    import { onMount } from "svelte"
    let server: ServerConfig = {
        id: uuidv4(),
        name: "",
        host: "",
        port: 6379,
        password: "",
    }

    export let open: boolean

    const handleAdd = async () => {
        await addServer(server);
        open = false;
    }

    $: addEnabled = server.name.length > 0 && server.host.length > 0 

    onMount(() => {
        console.log("AddServerDialog - onMount")
        // clear the server object
        server = {
            id: uuidv4(),
            name: "",
            host: "",
            port: 6379,
            password: "",
        }
    })
</script>

<Modal title="Add Redis Instance" bind:open autoclose>
    <EditServerPanel bind:server={server} />

    <svelte:fragment slot="footer">
        <div class="flex w-full space-x-2">
            <div class="grow" />
            <Button color="primary" disabled={!addEnabled} on:click={handleAdd}>Add Instance</Button>
        </div>
    </svelte:fragment>
</Modal>
