<!-- src/routes/activation.svelte -->
<script lang="ts">
    import ActivationCodeDialog from "../../components/AddDatabase/ActivationCodeDialog.svelte";
    import { goto } from '$app/navigation';
    let open = true;

    function handleClose() {
        goto('/');
    }
</script>

<ActivationCodeDialog bind:open on:close={handleClose} />