import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
    const serverId = params.serverId;

    if (!serverId) {
        return {
            status: 404,
            error: new Error('Server not found'),
        };
    }

    return { serverId };
}) satisfies PageServerLoad;