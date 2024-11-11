<script lang="ts">
    import { Modal } from "flowbite-svelte"
    import RedisCloudAccountPanel from "./RedisCloudAccountPanel.svelte"
    export let open: boolean
</script>

<Modal title="Manage Redis Cloud Accounts" bind:open size="lg">
    <RedisCloudAccountPanel />
</Modal>