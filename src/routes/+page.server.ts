// src/routes/+page.server.ts
import type { PageServerLoad } from "./$types"
import { getServerConfigs } from "$lib/server/servers"

export const load: PageServerLoad = async () => {
    const serverConfigs = await getServerConfigs()

    return {
        initialServers: serverConfigs,
    }
}
