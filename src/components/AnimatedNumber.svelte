<script lang="ts">
    import { tweened } from "svelte/motion"
    import { cubicOut } from "svelte/easing"

    export let value: number | string = 0
    export let textStyle: string = ""
    export let precision: number = 0
    // Initialize the tweened store
    const animatedValue = tweened(0, {
        duration: 400,
        easing: cubicOut,
    })

    // Handle value changes and determine if `value` is numeric
    let isValueNumeric = false
    let previousValue = value
    let valueChanged = false

    $: {
        const numValue = Number(value)
        isValueNumeric = !isNaN(numValue)
        if (isValueNumeric) {
            animatedValue.set(numValue)
        }
    }

    // Detect when `value` changes to trigger the pulse effect
    $: if (value !== previousValue) {
        valueChanged = true
        previousValue = value
    }

    // Reset the pulse effect after the animation ends
    function handleAnimationEnd() {
        valueChanged = false
    }

    // Format the animated value to zero decimal places
    $: formattedAnimatedValue = $animatedValue.toFixed(precision)
</script>

{#if isValueNumeric}
    <!-- Display animated number formatted to zero decimal places -->
    <p
        class="value-text {textStyle}"
        class:value-changed={valueChanged}
        on:animationend={handleAnimationEnd}
    >
        {formattedAnimatedValue}
    </p>
{:else}
    <!-- Display `value` directly if it's not a number -->
    <p class="{textStyle}">{value}</p>
{/if}

<style>
    .value-text {
        /* Common styles for the value text */
    }

    /* Define the pulse animation */
    @keyframes pulse {
        0% {
            color: red;
        }
        100% {
            /* Return to the original color */
            color: inherit;
        }
    }

    /* Apply the pulse animation when value-changed class is added */
    .value-text.value-changed {
        animation: pulse 0.8s ease-in-out;
    }
</style>
