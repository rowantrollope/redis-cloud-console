<script lang="ts">
    import { Card } from "flowbite-svelte"
    import { Toggle } from "flowbite-svelte"
    import { Input } from "flowbite-svelte"
    import { Label } from "flowbite-svelte"
    import { Range } from "flowbite-svelte"
    let emailEnabled = false
    let pagerDutyEnabled = false
    let smsEnabled = false

    const alerts = [
        {
            id: "memory",
            name: "Memory Usage Threshold",
            default: 80,
            enabled: true,
        },
        { id: "cpu", name: "CPU Utilization", default: 90, enabled: true },
        {
            id: "keyspace",
            name: "Keyspace Expiration",
            default: 1000,
            enabled: true,
        },
        {
            id: "replication",
            name: "Replication Issues",
            default: 60,
            enabled: true,
        },
        { id: "latency", name: "High Latency", default: 100, enabled: true },
        {
            id: "connections",
            name: "Client Connections",
            default: 90,
            enabled: true,
        },
        { id: "evictions", name: "Evictions", default: 1000, enabled: true },
        {
            id: "persistence",
            name: "Persistence Failures",
            default: 1,
            enabled: true,
        },
        { id: "diskio", name: "Disk I/O Issues", default: 80, enabled: true },
        {
            id: "process",
            name: "Redis Process Down",
            default: 1,
            enabled: true,
        },
    ]

    let thresholds = Object.fromEntries(
        alerts.map((alert) => [alert.id, alert.default])
    )

    function handleThresholdChange(id: string, value: number) {
        thresholds[id] = value
    }
</script>

<div class="flex flex-col items-start justify-start w-full p-4">
    <h1 class="text-2xl font-bold text-left pb-2">Monitoring & Alerting</h1>
    <p class="text-sm text-left pb-4">
        Configure alerting thresholds and notification channels for your Redis
        instance.
    </p>
</div>
<div
    class=" p-4 w-full mx-auto flex flex-col items-center justify-center space-y-4"
>
    <Card size="md" class="space-y-4">
        <!-- Email Alert -->
        <div class="flex items-center space-x-4">
            <Toggle bind:checked={emailEnabled} id="email" />
            <Label
                for="email"
                class="flex items-center space-x-2 cursor-pointer"
            >
                <span>Email Alerts</span>
            </Label>
            {#if emailEnabled}
                <Input
                    type="email"
                    placeholder="Enter email address"
                    class="ml-auto w-[250px]"
                />
            {/if}
        </div>
        <!-- PagerDuty Alert -->
        <div class="flex items-center space-x-4">
            <Toggle bind:checked={pagerDutyEnabled} id="pagerduty" />
            <Label
                for="pagerduty"
                class="flex items-center space-x-2 cursor-pointer"
            >
                <span>PagerDuty Alerts</span>
            </Label>
            {#if pagerDutyEnabled}
                <Input
                    type="text"
                    placeholder="Enter PagerDuty integration key"
                    class="ml-auto w-[250px]"
                />
            {/if}
        </div>
        <!-- SMS Alert -->
        <div class="flex items-center space-x-4">
            <Toggle bind:checked={smsEnabled} id="sms" />
            <Label for="sms" class="flex items-center space-x-2 cursor-pointer">
                <span>SMS Alerts</span>
            </Label>
            {#if smsEnabled}
                <Input
                    type="tel"
                    placeholder="Enter phone number"
                    class="ml-auto w-[250px]"
                />
            {/if}
        </div>
    </Card>
    <Card size="md" class="space-y-4 flex items-center">
        {#each alerts as alert}
            <div class="flex items-center space-x-2">
                <Toggle bind:checked={alert.enabled} id={alert.id} />
                <div class="flex flex-col items-center space-y-2">
                    <Label for={alert.id}>
                        {alert.name}
                    </Label>
                    <!-- Slider implemented with input range -->
                    <Range
                        id={alert.id}
                        min="0"
                        max="100"
                        step="1"
                        disabled={!alert.enabled}
                        bind:value={thresholds[alert.id]}
                        on:input={(e) =>
                            handleThresholdChange(alert.id, +e.target.value)}
                        class="w-96 cursor-pointer bg-gray-200"
                    />
                    <span class="w-12 text-right whitespace-nowrap">
                        {thresholds[alert.id]}
                        {alert.name !== "Persistence Failures" &&
                        alert.name !== "Redis Process Down"
                            ? "%"
                            : ""}
                    </span>
                </div>
            </div>
        {/each}
    </Card>
</div>

<style>
    /* Customize the slider's thumb and track */
    input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        background: transparent;
    }
    input[type="range"]:focus {
        outline: none;
    }
    input[type="range"]::-webkit-slider-runnable-track {
        height: 8px;
        cursor: pointer;
        background: #4ade80; /* Tailwind lime-400 */
        border-radius: 4px;
    }
    input[type="range"]::-webkit-slider-thumb {
        height: 20px;
        width: 20px;
        background: #10b981; /* Tailwind emerald-500 */
        border-radius: 50%;
        cursor: pointer;
        -webkit-appearance: none;
        margin-top: -6px;
    }
    input[type="range"]::-moz-range-track {
        height: 8px;
        cursor: pointer;
        background: #4ade80;
        border-radius: 4px;
    }
    input[type="range"]::-moz-range-thumb {
        height: 20px;
        width: 20px;
        background: #10b981;
        border-radius: 50%;
        cursor: pointer;
    }
</style>
