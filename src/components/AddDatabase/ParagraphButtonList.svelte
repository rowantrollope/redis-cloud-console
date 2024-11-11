// A group of buttons inside a styled list 
<script lang="ts">
    import ParagraphButton from "../components/ParagraphButton.svelte"
    import { ListGroup } from "flowbite-svelte"

    // convert this to a slot
    export let buttons: ParagraphButton[]
</script>
