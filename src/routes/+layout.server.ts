import type { LayoutServerLoad } from "./$types"
import { getServerConfigs } from "$lib/server/servers"
import { getCloudAccounts } from "$lib/server/accounts"
import { fetchRemoteServers } from "$lib/services/redisCloudServerService"
export const load: LayoutServerLoad = async ({ locals }) => {
    const userID = locals.userId

    if (!userID) {
        return {
            status: 302,
            redirect: "/auth/login",
        }
    }

    try {
        const initialServers = await getServerConfigs(userID)
        const initialCloudAccounts = await getCloudAccounts(userID)
        console.log("initialCloudAccounts: ", initialCloudAccounts)
        console.log("initialServers: ", initialServers

        )
        return {
            userID,
            initialServers,
            initialCloudAccounts,
            accessToken: locals.accessToken,
        }
    } catch (error) {
        console.error("Error loading data:", error)
        return {
            status: 500,
            error: "Failed to load data",
        }
    }
}
