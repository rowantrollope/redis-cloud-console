<script lang="ts">
    import type { ComponentType } from "svelte"
    import { Progressbar } from "flowbite-svelte"
    import { Card } from "flowbite-svelte"

    // Define the props the Card component will accept
    export let title: string
    export let value: string | number
    export let icon: ComponentType
    export let subtitle: string | null = null
    export let max: number | null = null
    export let current: number | null = null

    // Add a computed value for the progress percentage
    $: progressPercentage = max !== null && current !== null
        ? Math.min(Math.round((current / max) * 100), 100).toString()
        : '0'
</script>

<Card class="shadow-none dark:bg-slate-700 dark:border-slate-300">
    <div class="flex items-center">
        <h3 class="h3 dark:text-white">{title}</h3>
        <div class="grow"></div>
        <div class="icon">
            {#if icon}
                <svelte:component this={icon} />
            {/if}
        </div>
    </div>
    <p class="text-3xl font-bold dark:text-lime-400 text-slate-900">{value}</p>
    {#if max !== null && current !== null}
        <Progressbar class="dark:bg-slate-900 h-4 mt-2" progress={progressPercentage} />
    {:else if subtitle}
        <p class="subtitle">{subtitle}</p>
    {/if}
</Card>

<style>
    .icon {
        color: lightgray;
        width: 16px;
        height: 16px;
    }

    .h3 {
        @apply text-sm mb-2 text-slate-800 dark:text-white;
    }
    .subtitle {
        @apply text-xs text-slate-600 mt-1 dark:text-white;
    }
</style>
