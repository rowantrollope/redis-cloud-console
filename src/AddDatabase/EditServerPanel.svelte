<script lang="ts">
  import PasswordInput from '../components/PasswordInput.svelte';

    import { Input, Label } from "flowbite-svelte"
    import { type ServerConfig } from "$lib/types/types"

    export let server: ServerConfig 
    export let oneColumn = false 

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
            <PasswordInput bind:value={server.password} id="password"/>
        </div>
    </div>
        </div>
    <!-- <div class="flex flex-col gap-2"> -->
    <!-- <Toggle>Enable Automatic Data Compression</Toggle>
    <Toggle>Use TLS</Toggle>
    <Toggle>Use SSH Tunnel</Toggle> -->
    <!-- </div> -->



</form>
