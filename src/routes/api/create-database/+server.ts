import { getCloudAccounts } from '$lib/server/accounts';
import type { RequestHandler } from './$types';
import { json, error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, locals }) => {
    const { name } = await request.json();
    const userID = locals.userId
    console.log(`Creating database '${name}' for user ${userID}`);

    const accounts = await getCloudAccounts(userID)
    if (!accounts) {
        console.log(`No accounts found for user ${userID}`);
        return new Response("Account not found", { status: 404 })
    }
    console.log(`Found ${accounts.length} accounts for user ${userID}`);

    const headers = {
        "accept": "application/json",
        "x-api-key": accounts[0].accountKey,
        "x-api-secret-key": accounts[0].apiKey,
        "Content-Type": "application/json",
    }

    // Get subscriptions
    console.log('Fetching subscriptions...');
    const subsResponse = await fetch('https://api.redislabs.com/v1/fixed/subscriptions', {
        method: 'GET',
        headers,
    });

    if (!subsResponse.ok) {
        console.error(`Subscription fetch failed with status ${subsResponse.status}`);
        return error(subsResponse.status, 'Failed to fetch subscriptions');
    }

    const subData = await subsResponse.json();
    console.log(`Found ${subData.subscriptions.length} subscriptions`)

    // Create database in the first subscription
    console.log(
        `Creating database in subscription ${subData.subscriptions[0].id}...`
    )
    const createDbResponse = await fetch(
        `https://api.redislabs.com/v1/fixed/subscriptions/${subData.subscriptions[0].id}/databases`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({
                name,
                protocol: "stack",
                dataPersistence: "none",
                dataEvictionPolicy: "allkeys-lru",
                replication: true,
                alerts: [
                    {
                        name: "datasets-size",
                        value: 80
                    }
                ]
            }),
        }
    )

    if (!createDbResponse.ok) {
        let errorMessage = 'Failed to create database';
        console.error(`Database creation failed with status ${createDbResponse.status}:`, createDbResponse);
        return error(createDbResponse.status, errorMessage);
    }

    const responseData = await createDbResponse.json();
    console.log('Database created successfully:', responseData);
    return json(responseData);
}; 