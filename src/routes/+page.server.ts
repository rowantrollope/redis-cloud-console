// src/routes/+page.server.ts
import type { PageServerLoad } from "./$types"
import { getServerConfigs } from "$lib/server/servers"
import { getCloudAccounts } from "$lib/server/accounts"

export const load: PageServerLoad = async ({ locals }) => {
    return {}
};
