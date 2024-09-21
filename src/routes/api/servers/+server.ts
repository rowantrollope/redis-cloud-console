// src/routes/api/servers/+server.ts
import type { RequestHandler } from "./$types"
import { json, error } from "@sveltejs/kit"

import {
    getServerConfigs,
    addServerConfig,
    removeServerConfig,
    updateServerConfig, // Import the update function
} from "$lib/server/servers"

export const GET: RequestHandler = async ({ url, locals }) => {
    const userID = locals.userId;
    const id = url.searchParams.get("id");
    console.log(`GET servers - looking for ${id}`);
    const servers = await getServerConfigs(userID);
    if (id) {
        const server = servers.find((s) => s.id === id);
        if (server) {
            return json(server);
        } else {
            throw error(404, "Server not found");
        }
    }

    return json(servers);
}

export const POST: RequestHandler = async ({ request, locals }) => {
    console.log("/api/servers - POST new server config");
    const userID = locals.userId;
    const newConfig = await request.json();
    await addServerConfig(userID, newConfig);
    return new Response("Server configuration added", { status: 201 });
}

export const DELETE: RequestHandler = async ({ url, locals }) => {
    const userID = locals.userId;
    const id = url.searchParams.get("id");
    console.log("/api/servers - DELETE server config", id);
    if (id) {
        await removeServerConfig(userID, id);
        return new Response("Server configuration deleted", { status: 200 });
    } else {
        throw error(400, "Server ID not provided");
    }
}

export const PUT: RequestHandler = async ({ request, locals }) => {
    console.log("/api/servers - PUT update server config");
    const userID = locals.userId;
    const updatedConfig = await request.json();
    const id = updatedConfig.id;

    if (!id) {
        throw error(400, "Server ID not provided");
    }
    console.log("PUT ", updatedConfig);

    await updateServerConfig(userID, updatedConfig);
    return new Response("Server configuration updated", { status: 200 });
}
