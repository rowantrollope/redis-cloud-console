<script lang="ts">
    import PasswordInput from "../components/PasswordInput.svelte"
    import { APP_NAME } from "$lib/constants"

    import { Input, Label } from "flowbite-svelte"
    import { type ServerConfig } from "$lib/types/types"

    export let server: ServerConfig
    export let stats: ServerStats

    export let oneColumn = false
</script>

<form
    class="flex flex-col space-y-4 max-w-2xl mx-auto dark:text-white "
>
    <div class="bg-gray-50 rounded-md">
        <div class="flex items-center px-2 py-1">
            <span class="grow text-black">Name</span>
            <Input
                class="border-none w-fit text-right font-mono p-2"
                type="text"
                id="friendlyName"
                bind:value={server.name}
                required
                placeholder="Enter your database name"
            />
            <div>></div>
        </div>
    </div>
    
    <div class="uppercase text-xs pt-2">
        Connection Details
    </div>
    
    <div class="bg-gray-50 rounded-md flex flex-col space-y-2 divide-y">
        <div class="flex items-center pt-3 px-2">
            {#if server.type === "remote"}
                <span class="grow text-black">Connection type</span>
                <span class="text-sm"
                    >{APP_NAME} Proxy (redis.io/cloudinsight)</span
                >
                <p class="text-xs hidden">
                    This is used to identify this redis-server on the Redis
                    Cloud Management Console.
                </p>
            {:else if server.type === "local"}
                Connection type: <strong>Direct IP Connection</strong>
            {:else if server.type === "cloud"}
                Connection type: <strong>Redis Cloud</strong>
            {/if}
        </div>
        {#if server.type === "remote"}
            <div class="flex items-center pt-3 px-2">
                <span class="grow text-black">Hostname</span>
                <span class="font-mono text-sm">{stats?.hostname}</span>
                <p class="text-xs hidden">
                    Name of the local machine running the Redis server.
                </p>
            </div>
            <div class="flex items-center py-3 px-2">
                <span class="grow text-black">Database ID</span>
                <span class="font-mono text-sm">{server.id}</span>
                <p class="text-xs hidden">
                    This is used to identify this redis-server on the Redis
                    Cloud Management Console.
                </p>
            </div>
        {/if}
        <div class="border p-4 rounded-md flex flex-col space-y-4 hidden">
            {#if server.type === "remote"}
                <div class="text-sm">
                    Enter a username and password to connect to this Redis
                    Instance.
                </div>
            {/if}
            <div
                class="grid gap-6 mb-6 {oneColumn
                    ? 'grid-cols-1'
                    : 'md:grid-cols-1'}"
            >
                {#if server.type !== "remote"}
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
                {/if}
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
                <Label for="password">Password</Label>
                <div class="relative">
                    <PasswordInput bind:value={server.password} id="password" />
                </div>
            </div>
        </div>
    </div>

    <!-- <div class="flex flex-col gap-2"> -->
    <!-- <Toggle>Enable Automatic Data Compression</Toggle>
    <Toggle>Use TLS</Toggle>
    <Toggle>Use SSH Tunnel</Toggle> -->
    <!-- </div> -->
</form>
