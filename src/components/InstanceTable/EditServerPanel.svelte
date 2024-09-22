<script lang="ts">
    import { Input, Label, Toggle } from "flowbite-svelte"
    import { type ServerConfig } from "$lib/types/types"
    import {
        EyeOutline,
        EyeSlashOutline,
    } from "flowbite-svelte-icons"

    export let server: ServerConfig 
    export let oneColumn = false 
    let showPassword = false; // Add this line

</script>

<form>
    <div class="grid gap-6 mb-6 {oneColumn ? 'grid-cols-1' : 'md:grid-cols-2'}">

    <div>
        <Label for="friendlyName">Database Name</Label>
        <Input
        class="dark:bg-slate-800"
            type="text"
            id="friendlyName"
            bind:value={server.name}
            required
            placeholder="Enter your database name"
        />
    </div>
    <div>
        <Label for="host">Hostname or IP Address</Label>
        <Input
            class="dark:bg-slate-800"
            type="text"
            id="host"
            bind:value={server.host}
            required
            placeholder="Enter the hostname or IP Address"
        />
    </div>
    <div>
        <Label for="port">Port number</Label>
        <Input
            class="dark:bg-slate-800"
            type="number"
            id="port"
            bind:value={server.port}
            required
            placeholder="Enter port number (default: 6379)"
        />
    </div>
    <div>
        <Label for="port">Username</Label>
        <Input
            class="dark:bg-slate-800"
            type="text"
            id="username"
            bind:value={server.username}
            required
            placeholder="Enter Username (optional)"
        />
    </div>
    <div>
        <Label for="port">Timeout (Seconds)</Label>
        <Input
            class="dark:bg-slate-800"
            type="number"
            id="timeout"
            bind:value={server.timeout}
            required
            placeholder="Enter Timeout in Seconds (default: 30)"
        />
    </div>
    <div>
        <Label for="password">Password</Label>
        <div class="relative">
            <Input
                class="dark:bg-slate-800 pr-10"
                type={showPassword ? "text" : "password"}
                id="password"
                bind:value={server.password}
                placeholder="Enter password (optional)"
            />
            <button 
                type="button" 
                on:click={() => showPassword = !showPassword} 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
            >
                {#if showPassword}
                    <EyeSlashOutline class="h-5 w-5 text-gray-500" />
                {:else}
                    <EyeOutline class="h-5 w-5 text-gray-500" />
                {/if}
            </button>
        </div>
    </div>
        </div>
    <div class="flex flex-col gap-2">
    <!-- <Toggle>Enable Automatic Data Compression</Toggle>
    <Toggle>Use TLS</Toggle>
    <Toggle>Use SSH Tunnel</Toggle> -->
    </div>



</form>
