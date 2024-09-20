<script lang="ts">
    import { Input, Label } from "flowbite-svelte"
    import { type ServerConfig } from "$lib/types/types"

    export let server: ServerConfig 

</script>

<form class="grid gap-6 mb-6 md:grid-cols-2">
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
        <Label for="password">Password</Label>
        <Input
            class="dark:bg-slate-800"
            type="password"
            id="password"
            bind:value={server.password}
            placeholder="Enter password (optional)"
        />
    </div>
</form>
