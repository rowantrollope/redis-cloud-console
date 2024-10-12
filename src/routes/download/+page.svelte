<script lang="ts">
    import { Card } from "flowbite-svelte"
    import {
        ServerOutline,
        DownloadOutline,
        CloudArrowUpOutline,
        DatabaseOutline,
    } from "flowbite-svelte-icons"

    const downloads = [
        {
            title: "Redis Community Edition & Stack",
            version: "7.4",
            description:
                "Download the in-memory data store used by millions of developers as a cache, vector database, document database, streaming engine, and message broker.",
            icon: DatabaseOutline,
            buttonText: "Download Community Edition",
            link: "https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/",
        },
        {
            title: "Redis Connector",
            version: "1.0",
            description:
                "Download the Redis Agent to connect Redis instances to Redis Cloud Insight. Redis Connector connects to all versions of Redis.",
            icon: CloudArrowUpOutline,
            buttonText: "Download Redis Connector",
            link: "",
        },
        {
            title: "Redis Insight",
            version: "Latest",
            description:
                "Download a powerful tool for visualizing and optimizing data in Redis or Redis Stack.",
            icon: ServerOutline,
            buttonText: "Download Redis Insight",
            link: "https://redis.io/insight/",
        },
        {
            title: "Redis Software",
            version: "7.4.6",
            description:
                "Download the self-managed on-prem software with additional compliance, reliability, and resiliency for enterprise scaling.",
            icon: DownloadOutline,
            buttonText: "Download center",
            link: "https://cloud.redis.io/?_gl=1*lh5tc9*_gcl_au*OTc4NjgzMjczLjE3MjY1MTA5NDA.#/rlec-downloads",
        },
    ]
</script>

<div class="flex flex-col gap-2 items-start w-full justify-start p-4">
    <h1>Downloads</h1>
    <p>
        Download the latest version of Redis, our desktop management tool, or
        our agent to connect your Redis instances to Redis Cloud Insight.
    </p>
    <div class="w-full bg-white">
        <div
            class="flex flex-col m-auto max-w-4xl space-y-4 w-full items-center justify-center mt-8 bg-white"
        >
            {#each downloads as download}
                <Card
                    size="xl"
                    class="flex flex-col w-full items-start border-none shadow-none rounded-none dark:bg-slate-700 dark:border-slate-300"
                >
                    <div
                        class="w-full flex flex-col items-start justify-start text-left"
                    >
                        <h1 class="text-4xl mb-6 text-black">
                            {download.title}
                        </h1>
                        <hr class="w-full" />
                    </div>
                    <div class="flex">
                        <div
                            class="flex flex-col space-y-4 items-start justify-start"
                        >
                            <h2
                                class="text-3xl font-mono pt-5 dark:text-white text-black"
                            >
                                {download.version}
                            </h2>
                            <p class="w-full dark:text-gray-300 text-black">
                                {download.description}
                            </p>
                            <div class="mt-auto">
                                <a
                                    href={download.link}
                                    class="lime-button w-full mt-4"
                                >
                                    <DownloadOutline class="mr-2 h-4 w-4" />
                                    {download.buttonText}
                                </a>
                            </div>
                        </div>
                    </div>
                </Card>
            {/each}
        </div>
    </div>
</div>
