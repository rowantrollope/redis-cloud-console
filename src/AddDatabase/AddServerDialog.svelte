<!-- src/routes/add/+page.svelte -->
<script lang="ts">
    import EditServerPanel from "./EditServerPanel.svelte"
    import { v4 as uuidv4 } from "uuid"
    import { type ServerConfig, DatabaseType } from "$lib/types/types"
    import { Modal } from "flowbite-svelte"
    import { addServer } from "$lib/stores/serverStore"

    let server: ServerConfig = {
        type: DatabaseType.LOCAL,
        id: uuidv4(),
        name: "",
        host: "",
        port: 6379,
        password: "",
        username: "",
        timeout: 30,
    }

    export let open: boolean

    const handleAdd = async () => {
        console.log("handleAdd  ", server)
        await addServer(server)
        open = false
    }

    $: addEnabled = server.name.length > 0 && server.host.length > 0

    $: if (open) {
        server = {
            type: DatabaseType.LOCAL,
            id: uuidv4(),
            name: "",
            host: "",
            port: 6379,
            password: "",
            username: "",
            timeout: 30,
        }
    }

</script>

<Modal title="Add Redis Server" bind:open>
    <EditServerPanel bind:server />

    <svelte:fragment slot="footer">
        <div class="flex w-full space-x-2">
            <div class="grow" />
            <button
                class={addEnabled ? "lime-button" : "button-base bg-gray-300 hover:bg-gray-300 hover:text-gray-500"}
                disabled={!addEnabled}
                on:click={handleAdd}
            >
                Add
            </button>
        </div>
    </svelte:fragment>
</Modal>
