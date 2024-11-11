import type { RequestHandler } from "./$types"
import { getCloudAccount, getCloudDatabasesStream } from "$lib/server/accounts"

export const GET: RequestHandler = async ({ params, locals }) => {
    const userID = locals.userId
    const accountId = params.accountId

    if (!userID) {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        // Fetch the specific cloud account for the user
        const account = await getCloudAccount(userID, accountId)

        if (!account) {
            return new Response("Account not found", { status: 404 })
        }

        // Create a ReadableStream to stream data back to the client
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Fetch databases using async generators
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
                } catch (error) {
                    console.error("Error while streaming databases:", error)
                    controller.error(error)
                } finally {
                    // Close the stream when done
                    controller.close()
                }
            },
        })

        console.log(
            `GET /api/cloud-accounts/${accountId}/databases - Streaming databases`
        )

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/x-ndjson', // Use NDJSON format
            },
        })
    } catch (error) {
        console.error("Error fetching cloud databases:", error)
        return new Response("Failed to fetch cloud databases", { status: 500 })
    }
}
