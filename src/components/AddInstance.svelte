<!-- src/components/AddInstance.svelte -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Button } from "flowbite-svelte"
    import AddServerDialog from "./InstanceTable/AddServerDialog.svelte"
    
    const dispatch = createEventDispatcher();
    let addInstanceModalOpen = false;
    function addInstance() {
        // Logic to open a modal or navigate to the add instance page
        addInstanceModalOpen = true;
        dispatch('openAddInstanceModal');
    }
</script>

<Button on:click={addInstance} class="btn w-full">
    Add Instance
</Button>

<AddServerDialog bind:open={addInstanceModalOpen} />
