// src/routes/+page.server.ts
import type { PageServerLoad } from "./$types"
import { getServerConfigs } from "$lib/server/servers"

export const load: PageServerLoad = async ({ locals }) => {
    const userID = locals.userId;
    const serverConfigs = await getServerConfigs(userID);
    console.log("serverConfigs returned", serverConfigs)
    return {
        userID,
        initialServers: serverConfigs,
    };
};
