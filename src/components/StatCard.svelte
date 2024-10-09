<script lang="ts">
    import type { ComponentType } from "svelte"
    import { Progressbar } from "flowbite-svelte"
    import { Card } from "flowbite-svelte"
    import AnimatedNumber from "./AnimatedNumber.svelte"
    // Define the props the Card component will accept
    export let title: string
    export let value: number | string = 0 // Accept both number and string
    export let icon: ComponentType
    export let subtitle: string | null = null
    export let max: number | null = null
    export let current: number | null = null
    export let precision: number = 0
    export let suffix: string = ""
    // Computed value for the progress percentage
    $: progressPercentage =
        max !== null && current !== null
            ? Math.min(Math.round((current / max) * 100), 100)
            : 0
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
    <!-- Use AnimatedNumber component -->
    <div class="flex space-x-1 items-center text-3xl font-bold dark:text-lime-400 text-slate-900">
        <AnimatedNumber
            textStyle="text-3xl font-bold dark:text-lime-400 text-slate-900"
            {value}
            {precision}
        />
        {#if suffix}
            <span>{suffix}</span>
        {/if}
    </div>

    {#if max !== null && current !== null}
        <Progressbar
            class="dark:bg-slate-900 mt-2"
            progress={progressPercentage}
        />
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
