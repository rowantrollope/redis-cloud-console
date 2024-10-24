<script lang="ts">
    import { Card } from "flowbite-svelte"
    import { APP_NAME } from "$lib/constants"
    import { DownloadOutline } from "flowbite-svelte-icons"
    const connectorDownloadLink = "/redis-connector.zip"
</script>


<div class="flex flex-col gap-4 items-start w-full justify-start p-4">
    <div
        class="flex flex-col m-auto max-w-4xl space-y-4 w-full items-center justify-center mt-8 bg-white"
    >
        <Card
            size="xl"
            class="flex flex-col w-full items-start border-none shadow-none rounded-none dark:bg-slate-700 dark:border-slate-300"
        >
            <div
                class="w-full flex flex-col items-start justify-start text-left"
            >
                <h1 class="text-4xl mb-6 text-black">
                    Download Redis Connector
                </h1>
                <hr class="w-full" />
            </div>
            <div class="flex">
                <div class="flex flex-col space-y-4 items-start justify-start">
                    <h2
                        class="text-3xl font-mono pt-5 dark:text-white text-black"
                    >
                        
                    </h2>
                    <p class="w-full dark:text-gray-300 text-black">
                        Download the Redis Connector to connect your Redis
                        instances to {APP_NAME}. The Redis Connector works with
                        all versions of Redis.
                    </p>
                    <div class="mt-auto">
                        <a
                            href={connectorDownloadLink}
                            class="lime-button w-full mt-4"
                        >Download for Mac
                            <DownloadOutline class="mr-2 h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>
        </Card>
        <Card
            size="xl"
            class="flex flex-col w-full items-start border-none shadow-none rounded-none dark:bg-slate-700 dark:border-slate-300"
        >
            <div
                class="w-full flex flex-col items-start justify-start text-left"
            >
                <h1 class="text-4xl mb-6 text-black">
                    Installation instructions
                </h1>
                <hr class="w-full" />
            </div>
            <div class="flex">
                <div class="flex flex-col space-y-4 items-start justify-start">
                    <h2
                        class="text-xl font-mono pt-5 dark:text-white text-black"
                    >
                        
                    </h2>
                    <p class="w-full dark:text-gray-300 text-black">
                        Unzip the downloaded file and run the <code>redis-proxy-agent</code> application. 
                        Redis will automatically connect to the agent. 
                        Configure your settings in the <code>agent_config.json</code> file located in the 
                        application directory.
                    </p>

                </div>
            </div>
        </Card>
    </div>
</div>
