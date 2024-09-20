import type { PageServerLoad } from "./$types"
import { readRedisInfo } from "$lib/redisInfo" // Import the new function

export const load: PageServerLoad = async ({ params, fetch }) => {
    const { id } = params

    try {
        const url = `/api/redisstats?id=${encodeURIComponent(id)}`
        console.log("Fetching from URL:", url)

        const response = await fetch(url)

        console.log("Response status:", response.status)

        if (!response.ok) {
            console.log("Error")
            throw new Error("Server not found")
        }
        const data = await response.json()

        // Use readRedisStats to get the info
        let info = null
        try {
            info = await readRedisInfo(data)
        } catch (infoError) {
            console.error("Error reading redis stats: ", infoError)
        }

        return {
            id,
            serverConfig: data,
            info: info || null,
            error: null,
            state: data.state
        }
    } catch (err) {
        return {
            id,
            serverConfig: null,
            info: null,
            error: err.message,
            state: null
        }
    }
}
