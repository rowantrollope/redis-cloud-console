<!-- src/components/AddInstance.svelte -->
<script lang="ts">
    import { Card } from "flowbite-svelte"
    import { ArrowRightOutline } from "flowbite-svelte-icons"
</script>

<Card class="card flex flex-col space-y-2 text-sm" size="sm">
    <h2
        class="text-lg font-bold border-b tracking-tight text-gray-900 dark:text-white"
    >
        Featured Resources
    </h2>
    <ul>
        <li>
            <a href="https://trust.redis.io" class="hover:underline hover:text-red-500"
                >Redis Cloud Trust Center</a
            >
        </li>
        <li>
            <a href="/" class="hover:underline hover:text-red-500"
                >Reference Redis Documentation</a
            >
        </li>
        <li>
            <a href="/" class="hover:underline hover:text-red-500"
                >Develop apps with the Developer Portal</a
            >
        </li>
        <li>
            <a href="/" class="hover:underline hover:text-red-500"
                >Ask the Redis Community</a
            >
        </li>
    </ul>
    <br />
    <div class="flex border-b items-center hover:text-underline hover:text-red-500">
        <h2
            class="text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:text-underline hover:text-red-500 cursor-pointer"
        >
            New on Redis OneCloud
        </h2>
        <div class="grow"></div>
        <a href="/" class="text-xs"><ArrowRightOutline class="w-4 h-4" /></a>
    </div>
    <p>Learn about the latest features and updates on Redis OneCloud</p>

    <h2
        class="text-lg border-b font-bold tracking-tight text-gray-900 dark:text-white"
    >
        Support
    </h2>
    <p>
        Support plan: <span class="underline text-black hover:text-red-500">Basic Plan</span>
    </p>
    <p class="text-xs">
        You're on the Basic Plan. Upgrade to get access to our support team.
    </p>
    <div class="flex space-x-2 pt-4 justify-end">
        <a
            href="https://support.redislabs.com/hc/en-us"
            target="_blank"
            class="outline-button text-xs"
        >
            Chat with Support
        </a>
        <a
            href="https://support.redislabs.com/hc/en-us"
            target="_blank"
            class="no-outline-button text-xs"
        >
            View Support Options
        </a>
    </div>
</Card>
