<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';

    const dispatch = createEventDispatcher();
    export let length: number = 8;

    let inputs: string[] = new Array(length).fill('');
    let inputRefs: HTMLInputElement[] = [];

    function handleInput(event: Event, index: number) {
        const target = event.target as HTMLInputElement;
        let value = target.value.toUpperCase(); // Convert to uppercase

        if (value.length > 1) {
            pasteCode(value);
            return;
        }

        inputs[index] = value;

        if (value && index < length - 1) {
            let nextIndex = index + 1;
            inputRefs[nextIndex].focus();
        }

        dispatchCode();
    }

    function handleKeyDown(event: KeyboardEvent, index: number) {
        if (event.key === 'Backspace') {
            const target = event.target as HTMLInputElement;
            
            if (target.value === '') {
                // Move focus to the previous input if the current is empty
                if (index > 0) {
                    let prevIndex = index - 1;
                    inputRefs[prevIndex].focus();
                }
            } else {
                // Clear the current input
                inputs[index] = '';
            }
            dispatchCode();
        }
    }

    function handlePaste(event: ClipboardEvent) {
        event.preventDefault();
        const pasteData = event.clipboardData?.getData('Text') || '';
        pasteCode(pasteData);
    }

    function pasteCode(pasteValue: string) {
        const sanitizedValue = pasteValue.replace(/-/g, '').toUpperCase(); // Convert to uppercase
        const chars = sanitizedValue.slice(0, length).split('');
        inputs = chars.concat(new Array(length - chars.length).fill(''));
        let nextIndex = chars.length;
        nextIndex = Math.min(nextIndex, length - 1);
        inputRefs[nextIndex]?.focus();
        dispatchCode();
    }

    function dispatchCode() {
        const code = inputs.slice(0, 4).join('') + '-' + inputs.slice(4).join('');
        dispatch('input', code);
    }

    onMount(() => {
        inputRefs[0]?.focus();
    });
</script>

<div class="activation-code-input">
    {#each inputs as inputValue, index}
        {#if index === 4}
            <span class="dash">-</span>
        {/if}
        <input
            type="text"
            bind:this={inputRefs[index]}
            bind:value={inputs[index]}
            class="code-input"
            maxlength="1"
            on:input={(event) => handleInput(event, index)}
            on:keydown={(event) => handleKeyDown(event, index)}
            on:paste={handlePaste}
            autocomplete="off"
        />
    {/each}
</div>

<style>
    .activation-code-input {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    .code-input {
        width: 3rem;
        height: 3rem;
        text-align: center;
        font-size: 1.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .code-input:focus {
        border-color: #3182ce;
        outline: none;
        box-shadow: 0 0 0 1px #3182ce;
    }

    .dash {
        font-size: 1.5rem;
        margin: 0 0.5rem;
    }
</style>