<script lang="ts">
    import { Input } from "flowbite-svelte"
    import { EyeOutline, EyeSlashOutline } from "flowbite-svelte-icons"

    export let value: string | undefined
    export let id: string
    export let placeholder: string = "Enter password (optional)"
    export let tabIndex: string = "0"
    let showPassword = false // Add this line
</script>

<div class="relative">
    <Input
        class="dark:bg-slate-800 pr-10"
        type={showPassword ? "text" : "password"}
        id={id}
        bind:value
        {placeholder}
        tabIndex={tabIndex}
    />
    <button
        type="button"
        on:click={() => (showPassword = !showPassword)}
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
    >
        {#if showPassword}
            <EyeOutline class="h-5 w-5 text-gray-500" />
        {:else}
            <EyeSlashOutline class="h-5 w-5 text-gray-500" />
        {/if}
    </button>
</div>
