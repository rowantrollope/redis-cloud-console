import fetch from "node-fetch"

export async function getCapiKey(accessToken: string): Promise<any> {
    const response = await fetch(
        `${process.env.REDIS_CLOUD_API_URL}/capiKeys`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        }
    )

    if (!response.ok) {
        throw new Error(`Failed to retrieve CAPI key: ${response.statusText}`)
    }

    const data = await response.json()
    return data
}

// Optionally, create a function to ensure a CAPI key exists or create one if it doesn't
export async function ensureCapiKey(accessToken: string): Promise<any> {
    let capiKey = await getCapiKey(accessToken)

    if (!capiKey || capiKey.length === 0) {
        // Create a new CAPI key
        const response = await fetch(
            `${process.env.REDIS_CLOUD_API_URL}/capiKeys`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: "MyAppCapiKey",
                    // Include other necessary parameters
                }),
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to create CAPI key: ${response.statusText}`)
        }

        capiKey = await response.json()
    }

    return capiKey
}
