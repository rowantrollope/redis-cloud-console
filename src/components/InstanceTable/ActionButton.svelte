<script lang="ts">
    import {
        type ServerWithStats,
        ServerState,
        ServerType,
    } from "$lib/types/types"
    import { openRedisInsight } from "$lib/redisInfo"
    import { Button } from "flowbite-svelte"
    import {
        DotsHorizontalOutline,
        EditOutline,
        TrashBinOutline,
        ArrowRightOutline,
    } from "flowbite-svelte-icons"
    import { createEventDispatcher } from "svelte"

    export let server: ServerWithStats

    const SHOW_EDIT_BUTTON = false
    const SHOW_TRASH_BUTTON = false
    const SHOW_CONNECT_BUTTON = false
    const SHOW_ACTION_DRAWER = true

    const dispatch = createEventDispatcher()

    function connectClicked() {
        dispatch("connect")
    }
    function editClicked(event: MouseEvent) {
        event.stopPropagation()
        dispatch("edit")
    }
    function menuClicked() {
        dispatch("menu")
    }
    function removeClicked(event: MouseEvent) {
        event.stopPropagation()
        dispatch("remove")
    }
</script>

<div class="flex -space-x-1">
    {#if SHOW_ACTION_DRAWER}
        <Button
            color="none"
            on:click={() => {
                menuClicked()
            }}
        >
            <DotsHorizontalOutline />
        </Button>
    {/if}
    {#if SHOW_CONNECT_BUTTON && server.state === ServerState.SUCCESS}
        <Button
            size="xs"
            class="bg-slate-400 text-lime-500 px-2 py-1 hover:bg-lime-500 hover:text-black"
            on:click={connectClicked}
        >
            Connect
            <ArrowRightOutline class="w-5 h-5 pl-1 " />
        </Button>
    {/if}

    {#if SHOW_EDIT_BUTTON}
        <Button
            size="xs"
            color="none"
            class="text-gray-500 hover:bg-slate-500 hover:text-lime-500 space-x-1"
            on:click={editClicked}
        >
            <div class="flex">
                <EditOutline class="w-4 h-4" />
                <!-- <div>edit</div> -->
            </div>
        </Button>
    {/if}
    {#if SHOW_TRASH_BUTTON}
        <Button
            size="xs"
            color="none"
            class="text-gray-500 hover:bg-slate-500 hover:text-lime-500 space-x-1"
            on:click={removeClicked}
        >
            <div class="flex">
                <TrashBinOutline class="w-4 h-4" />
                <!-- <div>edit</div> -->
            </div>
        </Button>
    {/if}
</div>
