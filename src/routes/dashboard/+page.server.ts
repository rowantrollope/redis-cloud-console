import type { PageServerLoad } from "./$types"
import { ensureCapiKey } from "$lib/redisCloudAPI"

export const load: PageServerLoad = async ({ locals }) => {
    const accessToken = locals.accessToken

    if (!accessToken) {
        return {
            status: 302,
            redirect: "/auth/login",
        }
    }

    try {
        const capiKey = await ensureCapiKey(accessToken)

        return {
            capiKey,
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            error: "Failed to retrieve CAPI key",
        }
    }
}
