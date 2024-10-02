import type { RequestHandler } from "./$types"
import { getCloudAccount, getCloudDatabases } from "$lib/server/accounts"
import type { ServerWithStats } from "$lib/types/types"
import { json } from "@sveltejs/kit"

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

        // Fetch databases for the specified account
        const proDatabases = await getCloudDatabases(account, false)
        const fixedDatabases = await getCloudDatabases(account, true)
        const allDatabases: ServerWithStats[] = [
            ...proDatabases,
            ...fixedDatabases,
        ]

        console.log(
            `GET /api/cloud-databases/${accountId}/databases - Databases fetched: ${allDatabases.length}`
        )
        return json(allDatabases)
    } catch (error) {
        console.error("Error fetching cloud databases:", error)
        return new Response("Failed to fetch cloud databases", { status: 500 })
    }
}
