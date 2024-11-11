import type { RequestHandler } from "./$types"
import { json, error } from "@sveltejs/kit"
import { fetchRemoteServer } from "$lib/services/redisCloudServerService"
import { ServerType } from "$lib/types/types"
import { readRedisInfo } from "$lib/redisClient"

const requestQueue: (() => Promise<void>)[] = []
const REQUESTS_PER_SECOND = 5 
let isProcessing = false

async function processQueue() {
    if (isProcessing || requestQueue.length === 0) {
        return
    }

    isProcessing = true
    const nextRequest = requestQueue.shift()

    if (nextRequest) {
        await nextRequest()
    }

    setTimeout(() => {
        isProcessing = false
        processQueue()
    }, 1000 / REQUESTS_PER_SECOND)
}

export const GET: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get("id")

    if (!id || id === "") {
        throw error(400, "Missing server ID")
    }

    const serverConfig = JSON.parse(
        url.searchParams.get("serverConfig") || "{}"
    )

    if (!serverConfig || !serverConfig.id) {
        throw error(404, "Server configuration not found")
    }

    return new Promise((resolve, reject) => {
        requestQueue.push(async () => {
            try {
                if (serverConfig.type === ServerType.REMOTE) {
                    resolve(
                        json(await fetchRemoteServer(serverConfig.databaseUUID))
                    )
                } else if (
                    serverConfig.type === ServerType.LOCAL ||
                    serverConfig.type === ServerType.CLOUD
                ) {
                    resolve(json(await readRedisInfo(serverConfig)))
                } else {
                    // Unknown server type
                    resolve(json({ message: "Server type not supported" }))
                }
            } catch (err) {
                reject(error(500, "Failed to fetch server stats"))
            }
        })

        processQueue()
    })
}
