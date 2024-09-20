import type { RequestHandler } from './$types';
import { getServerConfigs } from "$lib/server/servers";
import { readRedisInfo } from '$lib/redisClient';

import { json, error } from '@sveltejs/kit'; // Import the json helper

export const GET: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get("id")
    if (!id) {
        throw error(400, "Missing server ID")
    }

    const serverConfigs = await getServerConfigs()
    const serverConfig = serverConfigs.find((s) => s.id === id)

    if (!serverConfig) {
        throw error(404, "Server not found")
    }

    try {
        const stats = await readRedisInfo(serverConfig)
        return json(stats)
    } catch (err) {
        console.error(
            `Error reading Redis info for server ${serverConfig.name}:`,
            err
        )
        throw error(500, "Failed to retrieve Redis stats")
}};