<script lang="ts">
    import PasswordInput from "../PasswordInput.svelte"
    import { APP_NAME } from "$lib/constants"
    import SettingsRow from "../SettingsRow.svelte"

    import { Input, Label } from "flowbite-svelte"
    import { type ServerConfig, type ServerStats } from "$lib/types/types"

    export let server: ServerConfig
    export let stats: ServerStats

    export let oneColumn = false
</script>

<form class="flex flex-col space-y-4 max-w-2xl mx-auto dark:text-white">
    <div class="bg-gray-50 rounded-md">
        <SettingsRow>
            <div slot="left">Name</div>
            <div slot="right">
                <Input
                    class="border-none text-right font-mono p-2"
                    type="text"
                    id="friendlyName"
                    bind:value={server.name}
                    required
                    placeholder="Enter your database name"
                />
            </div>
        </SettingsRow>
    </div>

    <div class="uppercase text-xs pt-2">Connection Details</div>

    <div class="bg-gray-50 rounded-md flex flex-col">
        {#if server.type === "remote"}
            <SettingsRow>
                <div slot="left">Connection Type</div>
                <div slot="right" class="font-mono text-sm">
                    {APP_NAME} Proxy (redis.io/cloudinsight)
                </div>
            </SettingsRow>
        {:else if server.type === "local"}
            <!-- Direct IP Connection -->
        {:else if server.type === "cloud"}
            <!-- Redis Cloud -->
        {/if}
        {#if server.type === "remote"}
            <SettingsRow>
                <div slot="left">Hostname</div>
                <div slot="right" class="font-mono text-sm">
                    {stats?.hostname}
                </div>
            </SettingsRow>
            <SettingsRow>
                <div slot="left">IP Address</div>
                <div slot="right" class="font-mono text-sm">
                    {stats?.ipv4}
                </div>
            </SettingsRow>
            <SettingsRow>
                <div slot="left">Port</div>
                <div slot="right" class="font-mono text-sm">
                    {stats?.port}
                </div>
            </SettingsRow>
            <SettingsRow>
                <div slot="left">Server ID</div>
                <div slot="right" class="font-mono text-sm">
                    {server.id}
                </div>
            </SettingsRow>
            <SettingsRow>
                <div slot="left">Agent ID</div>
                <div slot="right" class="font-mono text-sm uppercase">
                    {stats?.agent_id}
                </div>
            </SettingsRow>
        {/if}
        <div class="rounded-md flex flex-col">
            {#if server.type !== "remote"}
                <SettingsRow>
                    <div slot="left">Hostname or IP Address</div>
                    <div slot="right">
                        <Input
                            class="dark:bg-slate-800 border-none text-right"
                            type="text"
                            id="host"
                            bind:value={server.host}
                            required
                            placeholder="Enter the hostname or IP Address"
                        />
                    </div>
                </SettingsRow>
                <SettingsRow>
                    <div slot="left">Port number</div>
                    <div slot="right">
                        <Input
                            class="dark:bg-slate-800 border-none text-right"
                            type="number"
                            id="port"
                            bind:value={server.port}
                            required
                            placeholder="Enter port number (default: 6379)"
                        />
                    </div>
                </SettingsRow>
                <SettingsRow>
                    <div slot="left">Timeout (Seconds)</div>
                    <div slot="right">
                        <Input
                            class="dark:bg-slate-800 border-none text-right"
                            type="number"
                            id="timeout"
                            bind:value={server.timeout}
                            required
                            placeholder="Enter Timeout in Seconds (default: 30)"
                        />
                    </div>
                </SettingsRow>

                <SettingsRow>
                    <div slot="left">Username</div>
                    <div slot="right">
                        <Input
                            class="dark:bg-slate-800 border-none text-right"
                            type="text"
                            id="username"
                            bind:value={server.username}
                            required
                            placeholder="Enter Username (optional)"
                        />
                    </div>
                </SettingsRow>
                <SettingsRow>
                    <div slot="left">Password</div>
                    <div slot="right">
                        <PasswordInput
                            bind:value={server.password}
                            id="password"
                        />
                    </div>
                </SettingsRow>
            {/if}
        </div>

        <!-- <div class="flex flex-col gap-2"> -->
        <!-- <Toggle>Enable Automatic Data Compression</Toggle>
    <Toggle>Use TLS</Toggle>
    <Toggle>Use SSH Tunnel</Toggle> -->
        <!-- </div> -->
    </div>
</form>
