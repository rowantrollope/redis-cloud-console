import type { RequestHandler } from "./$types"
import { getCloudAccounts, getCloudDatabases } from "$lib/server/accounts"

import type { ServerWithStats } from "$lib/types/types"
import { json } from "@sveltejs/kit"

export const GET: RequestHandler = async ({ locals }) => {
    const userID = locals.userId

    if (!userID) {
        return new Response("Unauthorized", { status: 401 })
    }

    try {
        const accounts = await getCloudAccounts(userID)
        const allDatabases: ServerWithStats[] = []

        for (const account of accounts) {
            // Fetch and aggregate databases from both subscription types
            const proDatabases = await getCloudDatabases(account, false)
            const fixedDatabases = await getCloudDatabases(account, true)
            allDatabases.push(...proDatabases, ...fixedDatabases)
        }
        console.log(`GET \api\cloud-databases - allDatabases.length: ${allDatabases.length}`)
        return json(allDatabases)
        //return new Response(JSON.stringify(allDatabases), { status: 200 })
    } catch (error) {
        console.error("Error fetching cloud databases:", error)
        return new Response("Failed to fetch cloud databases", { status: 500 })
    }
}
