<!-- src/components/AddDatabase.svelte -->
<script lang="ts">
    import { Modal } from "flowbite-svelte"
    import AddServerDialog from "./AddServerDialog.svelte"
    import RedisCloudAccountDialog from "../CloudAccount/RedisCloudAccountDialog.svelte"
    import ActivationCodeDialog from "./ActivationCodeDialog.svelte"
    import ParagraphButton from "../components/ParagraphButton.svelte"
    import { ServerOutline, QrCodeOutline } from "flowbite-svelte-icons"
    import RedisIcon from "../components/RedisIcon.svelte"
    import { createEventDispatcher } from "svelte"
    import { goto } from "$app/navigation"
    const dispatch = createEventDispatcher()

    export let open: boolean

    let showAddServer = false
    let showAddCloudAccount = false
    let showActivationCodeDialog = false

    function openAddServer() {
        showAddServer = true
        open = false
    }

    function openAddCloudAccount() {
        showAddCloudAccount = true
        open = false
    }

    function openActivationCodeDialog() {
        showActivationCodeDialog = true
        open = false
    }

    function handleClose() {
        open = false
        dispatch('close')
    }

</script>

<Modal title="Create or Add a Redis Database" bind:open>
    <p>Choose an option to add your Redis database</p>
    <div
        class="flex flex-col divide-y divide-gray-100 border border-gray-100 rounded-lg"
    >
        <!-- New ParagraphButton -->
        <ParagraphButton
            title="Activate an existing Redis OSS Database"
            description="Activate a Redis OSS database with an activation code."
            on:click={openActivationCodeDialog}
        >
            <!-- Icon for activation code -->
            <div
                slot="icon"
                class="bg-green-500 rounded-md text-white h-10 w-10 flex items-center justify-center"
            >
                <QrCodeOutline size="lg" />
            </div>
        </ParagraphButton>
         <ParagraphButton
            title="Download & `Create a new Redis OSS Database"
            description="Download Redis OSS software and create a new database."
            on:click={() => goto("/download")}
        >
            <!-- Icon for activation code -->
            <div
                slot="icon"
                class="bg-green-500 rounded-md text-white h-10 w-10 flex items-center justify-center"
            >
                <QrCodeOutline size="lg" />
            </div>
        </ParagraphButton>
        <ParagraphButton
            title="Create database on Redis Cloud"
            description="Create a Redis Cloud database."
            on:click={openAddCloudAccount}
        >
            <RedisIcon slot="icon" />
        </ParagraphButton>
        <ParagraphButton
            title="Connect to Existing Database by IP/Hostname"
            description="Add a Redis database by providing the IP/Hostname and port"
            on:click={openAddServer}
        >
            <!-- Add Server Icon -->
            <div
                slot="icon"
                class="bg-black rounded-md text-white h-8 w-8 flex items-center justify-center"
            >
                <ServerOutline size="lg" />
            </div>
        </ParagraphButton>
    </div>
</Modal>

<!-- Include modals for adding server, cloud account, or activation code -->
{#if showAddServer}
    <AddServerDialog bind:open={showAddServer} />
{/if}

{#if showAddCloudAccount}
    <RedisCloudAccountDialog bind:open={showAddCloudAccount} />
{/if}

{#if showActivationCodeDialog}
    <ActivationCodeDialog
        bind:open={showActivationCodeDialog}
        on:close={handleClose}
    />
{/if}
