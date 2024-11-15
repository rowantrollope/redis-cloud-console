<script lang="ts">
    import ActivationCodeDialog from "../../components/AddDatabase/ActivationCodeDialog.svelte"
    import { Card } from "flowbite-svelte"
    import { ArrowRightOutline } from "flowbite-svelte-icons"

    let showActivationCodeDialog = false

    function handleClose() {
        showActivationCodeDialog = false
    }

    function openActivationCodeDialog() {
        showActivationCodeDialog = true
    }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-4xl font-bold text-left">Redis Cloud Console</h1>
    <p>Your central hub for managing Redis Databases in the cloud and on-prem</p>
    
    <Card class="card my-8" size="xl">
        <h2>
            How it works?
        </h2>
        <p class="mt-2">
            The Redis Cloud Console is a powerful web-based interface that
            allows you to manage both Redis Cloud instances and your own
            open-source Redis deployments. With an intuitive dashboard and
            comprehensive tools, you can easily monitor, configure, and scale
            your Redis databases.
        </p>
    </Card>

    <h2 class="text-2xl font-semibold mb-4">Getting Started</h2>
    <ol class="list-decimal list-inside space-y-4 mb-8">
        <li>
            <strong>Sign up or log in:</strong> Create a Redis Cloud account or log
            in to your existing account.
        </li>
        <li>
            <strong>Choose your path:</strong> Decide whether you want to manage
            your existing open-source Redis or create a new database in Redis Cloud.
        </li>
        <li>
            <strong>Configure your database:</strong> Set up your database parameters,
            including memory size, replication, and data persistence options.
        </li>
        <li>
            <strong>Connect to your database:</strong> Use the provided connection
            details to start using your Redis database in your applications.
        </li>
    </ol>
    
    <div class="flex items-center justify-center space-x-4 mb-12">
        <button
            class="text-lg px-6 py-3 lime-button"
            on:click={openActivationCodeDialog}
        >
            Start Managing My OSS Redis Now
        </button>
        <p>
            or
        </p>
        <a class="text-lg px-6 py-3 lime-button" href="/deploy">
            Create My Database in the Cloud
        </a>
    </div>

    <h2 class="text-2xl font-semibold mb-4">Key Features</h2>
    <div class="grid md:grid-cols-2 gap-6">
        <Card class="card">
            <h2>Unified Management</h2>
            Manage both Redis Cloud and open-source Redis instances from a single
            interface.
        </Card>
        <Card class="card">
            <h2>Real-time Monitoring</h2>
            Track performance metrics, set alerts, and visualize your database health
            in real-time.
        </Card>
        <Card class="card">
            <h2>Scalability</h2>
            Easily scale your databases up or down based on your needs, with just
            a few clicks.
        </Card>
        <Card class="card">
            <h2>Security Management</h2>
            Configure access control, encryption, and compliance settings to keep
            your data safe.
        </Card>
    </div>

    <div class="mt-12 text-center">
        <h2 class="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p class="mb-6">
            Whether you're managing existing Redis deployments or creating new
            cloud instances, the Redis Cloud Console has you covered.
        </p>
        <a class="text-lg px-6 py-3 no-outline-button" href="/how-it-works">
            Explore Redis Cloud Console
            <ArrowRightOutline class="ml-2 h-5 w-5" />
        </a>
    </div>
</div>

{#if showActivationCodeDialog}
    <ActivationCodeDialog
        bind:open={showActivationCodeDialog}
        on:close={handleClose}
    />
{/if}
