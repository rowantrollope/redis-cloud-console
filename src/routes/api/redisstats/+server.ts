import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';
import { readRedisInfo } from '$lib/redisClient';
import { fetchRemoteServerStats } from '$lib/services/redisCloudServerService';
import { DatabaseType } from '$lib/types/types';

export const GET: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get('id');
    if (!id) {
        throw error(400, 'Missing server ID');
    }

    const serverConfig = JSON.parse(url.searchParams.get('serverConfig') || '{}');
    if (!serverConfig || !serverConfig.id) {
        throw error(404, 'Server configuration not found');
    }

    try {
        let stats;
        if (serverConfig.type === DatabaseType.REMOTE) {
            // Fetch stats via redis-cloud-server
            stats = await fetchRemoteServerStats(serverConfig.databaseUUID);
        } else {
            // Existing logic for LOCAL and CLOUD servers
            stats = await readRedisInfo(serverConfig);
        }
        return json(stats);
    } catch (err) {
        console.error(`Error reading Redis info for server ${serverConfig.name}:`, err);
        throw error(500, 'Failed to retrieve Redis stats');
    }
};