import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
    const activationCode = url.searchParams.get('activationCode');
    const accountID = url.searchParams.get('accountID');

    if (!activationCode || !accountID) {
        return new Response(JSON.stringify({ error: 'Activation code and account ID are required.' }), { status: 400 });
    }

    const queryParams = new URLSearchParams({
        activationCode,
        accountID,
    });

    try {
        const response = await fetch(`http://localhost:8080/activation/claim?${queryParams}`, {
            method: 'GET',
        });
        if (response.ok) {
            console.log("Response is ok");
            const data = await response.json();
            console.log("Data:", data);
            return json(data);
        } else {
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
                errorData = { error: response.statusText };
            }
            console.log("Error Data:", errorData);
            return new Response(JSON.stringify({ error: errorData.error }), { status: response.status });
        }
    } catch (error) {
        console.error('Error forwarding activation code request:', error);
        return new Response(JSON.stringify({ error: 'Server error.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
