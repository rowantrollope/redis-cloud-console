<script lang="ts">
	import { ChevronRightOutline } from 'flowbite-svelte-icons';
    import { createEventDispatcher } from "svelte"
    const dispatch = createEventDispatcher()
    
    export let title: string = ""
    export let description: string = ""

    function onClick() {
        dispatch("click")
    }
</script>

<button
    class="p-4 flex space-x-4 text-slate-500 hover:bg-lime-500 items-center justify-start group"
    on:click={onClick}
>
        
    <slot name="icon" />
    <div class="flex flex-col items-start justify-start text-left grow">
        <div class="pb-1 dark:text-white dark:group-hover:text-black">
            {title}
        </div>
        <p class="text-sm text-gray-500">{description}</p>
    </div>
    <ChevronRightOutline size="lg"/>

</button>

<style>
    .icon {
        color: lightgray;
        width: 20px;
        height: 20px;
    }
</style>
