<script lang="ts">
    import { Radio } from "flowbite-svelte"
    import {
        InfoCircleOutline,
    } from "flowbite-svelte-icons"
    import { Button, Dropdown } from "flowbite-svelte"
    import { ChevronDownOutline } from "flowbite-svelte-icons"
    import { cloud_providers, cloud_plans, getRegionFlag, getFlagImage } from "$lib/data/plans"

    let selectedPlan = "dedicated"
    let deploymentName = ""
    let selectedProvider = "AWS"
    let selectedRegion = cloud_providers[0].regions[0].Name

    $: availableRegions =
        cloud_providers.find((p) => p.name === selectedProvider)?.regions || []

    async function createDeployment() {
        try {
            const response = await fetch("/api/create-database", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: deploymentName,
                    region: selectedRegion,
                    provider: selectedProvider,
                    plan: selectedPlan,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Error creating database:", errorData)
                alert(
                    `Failed to create database: ${errorData.message || response.statusText}`
                )
                return
            }

            const newDatabase = await response.json()
            // Update the UI to include the new database
            // You might have a store or state management to handle databases
            // For example:
            // databases.update(current => [...current, newDatabase]);

            console.log("Database created successfully:", newDatabase)
            alert("Database created successfully!")
            // Optionally redirect or update the UI
        } catch (error) {
            console.error("Error creating database:", error)
            alert("An unexpected error occurred while creating the database.")
        }
    }

    function goToAdvancedConfig() {
        // Logic to navigate to advanced configuration
        console.log("Navigating to advanced configuration")
    }

    function selectProvider(providerName: string) {
        selectedProvider = providerName
        selectedRegion =
            cloud_providers.find((p) => p.name === selectedProvider)?.regions[0]
                .Name || ""
    }

</script>

<section class="container mx-auto p-4">
    <div class="mb-6">
        <h1 class="text-3xl font-semibold text-left">
            Create Your Redis Database
        </h1>
        <p class="text-gray-500">
            Use a template below or set up advanced configuration options. You
            can also edit these configuration options once the cluster is
            created.
        </p>
    </div>
    <form on:submit|preventDefault={createDeployment} class="space-y-6">
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
                            on:change={() => (selectedPlan = plan.id)}
                        />
                        <h2 class="text-xl font-semibold">{plan.name}</h2>
                        <div class="grow"></div>
                        <div>
                            {plan.price}
                        </div>
                    </div>
                    <p class="text-sm text-gray-500 mt-2">{plan.description}</p>
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

        <!-- Pay as you go -->
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
                    <span class="text-black font-bold">Pay as you go:</span> You
                    will be billed hourly and can terminate your cluster at any time.
                    Excludes variable data transfer, backup, and taxes.
                {/if}
            </p>
        </div>

        <!-- Deployment Details -->
        <div class="flex flex-col space-y-4 mt-8">
            <!-- Deployment Name -->
            <div>
                <label
                    for="deploymentName"
                    class="block text-sm font-medium text-gray-700">Name</label
                >
                <input
                    type="text"
                    id="deploymentName"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    placeholder="Enter database name"
                    bind:value={deploymentName}
                    required
                />
            </div>

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
                                src={provider.logo}
                                alt={provider.name}
                                class="provider-logo"
                            />
                        </button>
                    {/each}
                </div>
            </div>

            <!-- Region Selection -->
            <div>
                <label
                    for="region"
                    class="block text-sm font-medium text-gray-700"
                    >Region</label
                >
                <div class="mt-1">
                    <Button
                        color="light"
                        class="w-full space-x-2 flex items-center justify-start"
                    >
                        <img
                            src={getRegionFlag(selectedProvider, selectedRegion)}
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

        <!-- Buttons -->
        <div class="flex space-x-4 mt-8 justify-end">
            <button
                type="button"
                class="outline-button"
                on:click={goToAdvancedConfig}>Advanced Configuration</button
            >
            <button type="submit" class="lime-button">Create Database</button>
        </div>
    </form>
</section>

<style>
    .plan-card {
        cursor: pointer;
        border: 2px solid;
        transition: border-color 0.2s;
        @apply border-gray-200;
    }
    .plan-card.selected {
        border-width: 2px;
        @apply border-red-500;
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
        @apply border-red-500;
    }
    .provider-logo {
        height: 40px;
        width: auto;
    }
</style>
