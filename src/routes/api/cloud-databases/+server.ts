import type { RequestHandler } from "./$types"
import { getCloudAccounts, getCloudDatabasesStream } from "$lib/server/accounts"

import type { ServerWithStats } from "$lib/types/types"

export const GET: RequestHandler = async ({ locals }) => {
    const userID = locals.userId

    if (!userID) {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const accounts = await getCloudAccounts(userID)

        // Create a ReadableStream to stream data back to the client
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for (const account of accounts) {
                        // Fetch databases for the current account using async generators
                        const proDatabases = getCloudDatabasesStream(account, false)
                        const fixedDatabases = getCloudDatabasesStream(account, true)

                        // Stream pro databases
                        for await (const database of proDatabases) {
                            controller.enqueue(JSON.stringify(database) + '\n')
                        }

                        // Stream fixed databases
                        for await (const database of fixedDatabases) {
                            controller.enqueue(JSON.stringify(database) + '\n')
                        }
                    }
                } catch (error) {
                    console.error("Error while streaming databases:", error)
                    controller.error(error)
                } finally {
                    // Ensure the stream is closed
                    controller.close()
                }
            }
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/x-ndjson',
            }
        })
    } catch (error) {
        console.error("Error initializing stream:", error)
        return new Response("Failed to fetch cloud databases", { status: 500 })
    }
}
