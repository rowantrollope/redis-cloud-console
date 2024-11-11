<script lang="ts">
    import { Label } from "flowbite-svelte"
    import PasswordInput from '../PasswordInput.svelte';
    import { type RedisCloudAccount } from '$lib/types/types';
    
    export let account: RedisCloudAccount | null = null

</script>

<div class="w-full flex flex-col gap-2">    
    <div class="mb-4">
        <Label for="accountApiKey" class="mb-2">API Account Key</Label>
        <PasswordInput
            bind:value={account.accountKey}
            id="accountApiKey"
            placeholder="Enter your Account API Key"
        />
    </div>

    <div>
        <Label for="userApiKey" class="mb-2">User API Key</Label>
        <PasswordInput
            bind:value={account.apiKey}
            placeholder="Enter your User API Key"
            id="userApiKey"
        />
    </div>
    <div class="flex justify-end mt-4">
        <button class="lime-button">Connect</button>
    </div>
</div>
