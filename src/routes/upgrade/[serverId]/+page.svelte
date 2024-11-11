<script lang="ts">
    import type { PageData } from "./$types"
    import { Radio, Button, Dropdown } from "flowbite-svelte"
    import {
        InfoCircleOutline,
        ChevronDownOutline,
        ArrowRightOutline,
    } from "flowbite-svelte-icons"
    import {
        cloud_providers,
        cloud_plans,
        getRegionFlag,
        getFlagImage,
    } from "$lib/data/plans"
    import { servers } from "$lib/stores/serverStore"
    import { get } from "svelte/store"
    import { onMount } from "svelte"

    import { getRedisVersion } from "$lib/redisInfo"

    export let data: PageData
    const { serverId } = data

    let selectedPlan = "dedicated"
    let server = get(servers).find((s) => s.config.id === serverId)
    let selectedProvider = "AWS"
    let selectedRegion = cloud_providers[0].regions[0].Name
    function getProviderName(provider: string) {
        return cloud_providers.find((p) => p.name === provider)?.name || ""
    }
    function getPlanName(plan: string) {
        return cloud_plans.find((p) => p.id === plan)?.name || ""
    }
    // Compute available regions based on the selected provider
    $: availableRegions =
        cloud_providers.find((p) => p.name === selectedProvider)?.regions || []

    // Update selected region if necessary
    $: if (!selectedRegion && availableRegions.length > 0) {
        selectedRegion = availableRegions[0].Name
    }

    function selectProvider(providerName: string) {
        selectedProvider = providerName
        selectedRegion =
            cloud_providers.find((p) => p.name === selectedProvider)?.regions[0]
                .Name || ""
    }

    async function upgradeServer() {
        try {
            const response = await fetch(
                `/api/upgrade-database?serverId=${serverId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        plan: selectedPlan,
                        provider: selectedProvider,
                        region: selectedRegion,
                    }),
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Error upgrading database:", errorData)
                alert(
                    `Failed to upgrade database: ${errorData.message || response.statusText}`
                )
                return
            }

            const updatedDatabase = await response.json()
            console.log("Database upgraded successfully:", updatedDatabase)
            alert("Database upgraded successfully!")
            // Optionally redirect or update the UI
        } catch (error) {
            console.error("Error upgrading database:", error)
            alert("An unexpected error occurred while upgrading the database.")
        }
    }

    function goToAdvancedConfig() {
        // Logic to navigate to advanced configuration
        console.log("Navigating to advanced configuration")
    }

    // Assuming you have statistics about the data being migrated
    let migrationStats = {
        totalKeys: 25,
        totalSize: "53 MB",
        estimatedTime: "1 minutes",
    }

    // Fetch migration stats when the component is initialized
    // You should replace this with actual data fetching logic
    onMount(async () => {
        // Fetch migration stats from an API or compute them here
        // For example:
        const response = await fetch(
            `/api/get-migration-stats?serverId=${serverId}`
        )
        if (response.ok) {
            migrationStats = await response.json()
        } else {
            console.error("Failed to fetch migration stats")
        }
    })
</script>

<section class="container mx-auto p-4 flex flex-col gap-4">
    <div class="mb-6">
        <h1 class="text-4xl font-semibold text-left">
            Upgrade Your OSS Redis Database
        </h1>
        <p class="text-gray-500">
            Upgrade your OSS Redis database to a Redis Cloud database.
        </p>
    </div>

    <h1 class="text-left text-2xl">Step 1: Select a plan</h1>
    <form on:submit|preventDefault={upgradeServer} class="space-y-6 ml-6">
        <!-- Plan Selection -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            {#each cloud_plans as plan}
                <button
                    type="button"
                    class="plan-card flex flex-col space-y-3 card p-4 border-2 border-slate-500 w-full text-left {plan.id ===
                    selectedPlan
                        ? 'selected'
                        : ''}"
                    on:click={() => (selectedPlan = plan.id)}
                >
                    <div class="flex items-center justify-start w-full">
                        <Radio
                            name="plan"
                            value={plan.id}
                            bind:group={selectedPlan}
                            class="mr-2"
                        />
                        <h2 class="text-xl font-semibold">{plan.name}</h2>
                        <div class="grow"></div>
                        <div>
                            {plan.price}
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">
                        {plan.description}
                    </p>
                    <div class="grow"></div>
                    <!-- Plan Details Table -->
                    <table class="mt-8 w-full text-sm text-gray-500">
                        <thead>
                            <tr>
                                <th class="text-left">Storage</th>
                                <th class="text-left">vCPU</th>
                                <th class="text-left">Ops/Sec</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="text-black font-bold">
                                <td>{plan.details.dataset}</td>
                                <td>{plan.details.vcpu}</td>
                                <td>{plan.details.ops}</td>
                            </tr>
                        </tbody>
                    </table>
                </button>
            {/each}
        </div>

        <!-- Billing Information -->
        <div
            class="border-t p-3 bg-green-100 flex space-x-1 items-center rounded-md"
        >
            <InfoCircleOutline class="w-4 h-4 text-black" />
            <p class="text-sm text-gray-500">
                {#if selectedPlan === "free"}
                    <span class="text-black font-bold">Shared:</span> You will be
                    billed per GB of data stored and retrieved. You can upgrade or
                    downgrade your plan at any time. First 5GB is free.
                {:else if selectedPlan === "serverless"}
                    <span class="text-black font-bold">Serverless:</span> Pay only
                    for what you use: You will be billed monthly per GB of data stored
                    and retrieved.
                {:else if selectedPlan === "dedicated"}
                    <span class="text-black font-bold">Pay as you go:</span>
                    You will be billed hourly and can terminate your cluster at any
                    time. Excludes variable data transfer, backup, and taxes.
                {/if}
            </p>
        </div>

        <!-- Provider and Region Selection -->
        <div class="flex space-x-4 items-cen">
            <!-- Provider Selection -->
            <div>
                <label
                    id="provider-label"
                    class="block text-sm font-medium text-gray-700 mb-2"
                >
                    Provider
                </label>
                <div
                    role="radiogroup"
                    aria-labelledby="provider-label"
                    class="flex space-x-4"
                >
                    {#each cloud_providers as provider}
                        <button
                            type="button"
                            class="provider-button {provider.name ===
                            selectedProvider
                                ? 'selected'
                                : ''}"
                            on:click={() => selectProvider(provider.name)}
                        >
                            <img
                                src={"/" + provider.logo}
                                alt={"/" + provider.name}
                                class="provider-logo"
                            />
                        </button>
                    {/each}
                </div>
            </div>
            <br />
            <!-- Region Selection -->
            <div class="grow">
                <label
                    for="region"
                    class="block text-sm font-medium text-gray-700"
                    >Select {selectedProvider} region</label
                >
                <div class="mt-1">
                    <Button
                        color="light"
                        class="w-full h-14 mt-2 space-x-2 flex items-center justify-start"
                    >
                        <img
                            src={getRegionFlag(
                                selectedProvider,
                                selectedRegion
                            )}
                            alt={selectedRegion}
                            class="w-5 h-4 object-cover"
                        />
                        <div class="">
                            {selectedRegion || "Select a region"}
                        </div>
                        <div class="grow"></div>
                        <ChevronDownOutline class="w-5 h-5 ms-2" />
                    </Button>

                    <Dropdown class="w-full">
                        {#each availableRegions as region}
                            <div
                                class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                on:click={() => (selectedRegion = region.Name)}
                                on:keydown={(e) =>
                                    e.key === "Enter" &&
                                    (selectedRegion = region.Name)}
                                role="button"
                                tabindex="0"
                            >
                                <img
                                    src={getFlagImage(region.Flag)}
                                    alt={region.Flag}
                                    class="w-5 h-4 object-cover"
                                />
                                <span>{region.Name} - {region.RegionID}</span>
                            </div>
                        {/each}
                    </Dropdown>
                </div>
            </div>
        </div>
    </form>
    <h1 class="text-left text-2xl">Step 2: Confirm</h1>
    <!-- Server to Upgrade Card -->
    <div class="flex flex-col gap-4">
        <div class="flex items-center h-full space-x-4">
            <div
                class="card p-4 border-2 border-gray-200 w-full text-left ml-6 h-96"
            >
                <h2 class="text-xl font-semibold text-gray-500">
                    Source:
                    <span class="text-black">{server?.config.name}</span> -
                    {#if server && server.stats}
                        <span class="text-black">{getRedisVersion(server)}</span
                        >
                    {/if}
                </h2>
                <div>
                    <!-- Server Version: {getRedisVersion(server)} -->
                </div>
                <div class="flex gap-4 mt-4">
                    <div>
                        <label
                            for="ip-address"
                            class="block text-sm font-medium text-gray-700"
                            >IP Address</label
                        >
                        <div id="ip-address" class="mt-1 text-gray-900">
                            {server?.config.host}
                        </div>
                    </div>
                    <div>
                        <label
                            for="port"
                            class="block text-sm font-medium text-gray-700"
                            >Port</label
                        >
                        <div id="port" class="mt-1 text-gray-900">
                            {server?.config.port}
                        </div>
                    </div>

                    <div>
                        <label
                            for="password"
                            class="block text-sm font-medium text-gray-700"
                            >Password</label
                        >
                        <div id="password" class="mt-1 text-gray-900">
                            ••••••••
                        </div>
                    </div>
                    <!-- Add other relevant stats as needed -->
                </div>
                <!-- Data Migration Info -->
                <div class="p-4 mt-4 bg-green-50 rounded-md">
                    <h3 class="text-lg font-semibold">
                        Data Migration Information
                    </h3>
                    <p class="text-sm text-gray-700 mt-2">
                        Your current database contains <strong
                            >{migrationStats.totalKeys}</strong
                        >
                        keys, totaling
                        <strong>{migrationStats.totalSize}</strong>. The
                        migration process is estimated to take approximately
                        <strong>{migrationStats.estimatedTime}</strong>. During
                        the upgrade, your data will be securely transferred to
                        the new database instance.
                    </p>
                </div>
            </div>
            <ArrowRightOutline class="w-10 h-10 text-black" />
            <div
                class="card flex flex-col space-y-4 p-4 border-2 border-gray-200 w-full text-left h-96"
            >
                <h2 class="text-xl font-semibold text-gray-500">
                    Destination: <span class="text-black">Redis Cloud</span> -
                    <span class="text-black">Redis 7.4</span>
                </h2>
                <div>
                    <!-- selected plan -->
                    <div>
                        <span class="text-gray-500">Plan:</span>
                        <span class="text-black">{getPlanName(selectedPlan)}</span>
                    </div>
                    <!-- selected provider -->
                    <div>
                        <span class="text-gray-500">Provider:</span>
                        <span class="text-black">{getProviderName(selectedProvider)}</span>
                    </div>
                    <!-- selected region -->
                    <div class="flex items-center space-x-2">
                        <div class="text-gray-500">Region:</div>
                        <div class="text-black flex space-x-2 items-center">
                            <img
                                src={getRegionFlag(
                                    selectedProvider,
                                    selectedRegion
                                )}
                                alt={selectedRegion}
                                class="w-5 h-4 object-cover"
                            />
                            <div>
                                {selectedRegion}
                            </div>
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">
                        The new database will be created in the selected region.
                        Your data will be automatically migrated to the new
                        database.
                    </p>
                    <p class="text-sm text-gray-500 mt-2">
                        You'll be able to change all these settings later.
                    </p>
                    <p class="text-sm text-gray-500 mt-2">
                        You'll be billed for the new database at the selected
                        plan and provider.
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Upgrade Buttons -->
    <div class="flex space-x-4 mt-8 justify-end">
        <button
            type="button"
            class="outline-button"
            on:click={goToAdvancedConfig}>Advanced Configuration</button
        >
        <button type="submit" class="lime-button">Upgrade Database</button>
    </div>
</section>

<style>
    .plan-card {
        cursor: pointer;
        border: 2px solid;
        transition: border-color 0.2s;
        border-color: lightgray;
    }
    .plan-card.selected {
        border-color: red;
    }
    .provider-button {
        cursor: pointer;
        border: 2px solid transparent;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: border-color 0.2s;
        background-color: #ffffff;
    }
    .provider-button.selected {
        border-color: red;
    }
    .provider-logo {
        height: 40px;
        width: auto;
    }
</style>
