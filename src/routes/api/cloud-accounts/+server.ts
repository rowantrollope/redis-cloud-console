import type { RequestHandler } from "./$types"
import { json, error } from "@sveltejs/kit"
import {
    addCloudAccount,
    getCloudAccounts,
    removeCloudAccount,
} from "$lib/server/accounts"
import type { RedisCloudAccount } from "$lib/types/types"

export const GET: RequestHandler = async ({ locals }) => {
    const userID = locals.userId

    if (!userID) {
        throw error(401, "Unauthorized")
    }

    try {
        const accounts = await getCloudAccounts(userID)
        return json(accounts)
    } catch (err) {
        console.error("Error fetching cloud accounts:", err)
        throw error(500, "Failed to retrieve cloud accounts")
    }
}

export const POST: RequestHandler = async ({ request, locals }) => {
    const userID = locals.userId

    if (!userID) {
        throw error(401, "Unauthorized")
    }

    const account: RedisCloudAccount = await request.json()

    if (!account || !account.id || !account.name) {
        throw error(400, "Invalid account data")
    }

    try {
        await addCloudAccount(userID, account)
        return json({ success: true })
    } catch (err) {
        console.error("Error adding cloud account:", err)
        throw error(500, "Failed to add cloud account")
    }
}

export const DELETE: RequestHandler = async ({ url, locals }) => {
    const userID = locals.userId
    const accountId = url.searchParams.get("id")

    if (!userID || !accountId) {
        throw error(400, "Missing required parameters")
    }

    try {
        await removeCloudAccount(userID, accountId)
        return json({ success: true })
    } catch (err) {
        console.error("Error removing cloud account:", err)
        throw error(500, "Failed to remove cloud account")
    }
}
