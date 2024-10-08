<script lang="ts">
    import { Modal } from "flowbite-svelte"
    import { createEventDispatcher } from "svelte"
    import { addServer } from "$lib/stores/serverStore"
    import { type RemoteServerConfig, ServerType } from "$lib/types/types"
    import { v4 as uuidv4 } from "uuid"
    export let open: boolean
    import ActivationCodeInput from "./ActivationCodeInput.svelte" 
    import { userStore } from "$lib/stores/userStore"; // Import the user store
    import { get } from "svelte/store";
    import { activationClaim } from '$lib/services/redisCloudServerService';

    let openDetailsDialog = false
    const dispatch = createEventDispatcher()
    import ActivationDetailsDialog from "./ActivationDetailsDialog.svelte"
    let code = ""

    function assembleCode() {
        return code
    }

    let server: RemoteServerConfig = {
        type: ServerType.REMOTE,
        id: "",
        name: "My new database",
        username: "",
        password: ""
    }

    let error = ""

    function handleAddDatabase(server: RemoteServerConfig) {
        console.log("handleAddDatabase", server.id)

        openDetailsDialog = true

    }
    function onSave() {
        addServer(server)
        openDetailsDialog = false
        open = false
        dispatch('close')
    }

    async function submitActivationCode() {
        error = "";
        code = assembleCode();
        if (!code.trim()) {
            error = "Activation code is required.";
            return;
        }

        try {
            const data = await activationClaim(code);
            console.log("activationClaim data: ", data)
            // Create new REMOTE server config
            server = {
                id: data.redis_server_id,
                name: 'New Remote Database',
                type: ServerType.REMOTE,
                username: "",
                password: ""
            };
            // Open a dialog to edit server details
            handleAddDatabase(server);
        } catch (err: any) {
            error = err.message || 'An error occurred while processing your request.';
            console.error(err);
        }
    }

    function handleCodeInput(event: CustomEvent<string>) {
        code = event.detail;
    }
</script>

<Modal title="Enter Activation Code" bind:open>
    <div class="p-4 flex items-center flex-col space-y-4 justify-center">
        
        <div>
            <label
                for="code"
                class="block font-medium text-gray-700 text-center mb-4"
                >Please enter the activation code from the redis-server</label
            >
            <ActivationCodeInput on:input={handleCodeInput} />
            <!-- <input
                type="text"
                id="code"
                class="mt-1 block w-32 shadow-sm sm:text-sm border-gray-300 rounded-md"
                maxlength="9"
                bind:value={code}
                on:keyup={(e) => e.key === "Enter" && submitActivationCode()}
            /> -->
        </div>
        {#if error}
            <p class="mt-2 text-sm text-red-600">{error}</p>
        {/if}
    </div>
    <div slot="footer" class="flex items-end w-full">
        <div class="grow"></div>

        <button
            type="button"
            class={code.length === 9 ? "lime-button" : "button-base bg-gray-300"}
            on:click={submitActivationCode}
        >
            Activate
        </button>
    </div>
</Modal>

<ActivationDetailsDialog
    bind:open={openDetailsDialog}
    bind:server
    on:save={onSave}
/>