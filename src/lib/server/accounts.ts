import { redisClient } from "$lib/redisClient"
import { encrypt, decrypt } from "$lib/server/encryption"
import type { RedisCloudAccount, ServerWithStats } from "$lib/types/types"
import { ServerType, ServerState } from "$lib/types/types"

const CLOUD_ACCOUNTS_KEY = "cloudAccounts"

export async function addCloudAccount(
    userID: string,
    account: RedisCloudAccount
) {
    try {
        // Encrypt sensitive fields before storing
        const encryptedAccountKey = encrypt(account.accountKey)
        const encryptedApiKey = encrypt(account.apiKey)

        const accountData = {
            ...account,
            accountKey: encryptedAccountKey,
            apiKey: encryptedApiKey,
        }
        // store the account data in a Redis hash
        if (await redisClient.exists(`user:${userID}:${CLOUD_ACCOUNTS_KEY}`)) {
            await redisClient.json.arrAppend(
                `user:${userID}:${CLOUD_ACCOUNTS_KEY}`,
                "$",
                accountData
            )
        } else {
            await redisClient.json.set(
                `user:${userID}:${CLOUD_ACCOUNTS_KEY}`,
                "$",
                [accountData]
            )
        }

        console.log(`Cloud account ${account.name} added for user ${userID}`)
    } catch (error) {
        console.error("Error adding cloud account:", error)
        throw error
    }
}

// Fetch a single cloud account for a user by account ID
export async function getCloudAccount(
    userId: string,
    accountId: string
): Promise<RedisCloudAccount | null> {
    // Implement logic to retrieve the cloud account from your data source
    // Example:
    const accounts = await getCloudAccounts(userId)
    return accounts.find((account) => account.id === accountId) || null
}

export async function getCloudAccounts(
    userID: string
): Promise<RedisCloudAccount[]> {
    try {
        const userAccountsKey = `user:${userID}:${CLOUD_ACCOUNTS_KEY}`

        const accounts: RedisCloudAccount[] = (await redisClient.json.get(
            userAccountsKey
        )) as unknown as RedisCloudAccount[]

        if (accounts) {
            console.log(accounts)
            for (const account of accounts) {
                // Decrypt sensitive fields
                const decryptedAccountKey = decrypt(account.accountKey)
                const decryptedApiKey = decrypt(account.apiKey)
                account.accountKey = decryptedAccountKey
                account.apiKey = decryptedApiKey
            }
            return accounts
        } else {
            return []
        }
    } catch (error) {
        console.error("Error retrieving cloud accounts:", error)
        return []
    }
}

export async function removeCloudAccount(
    userID: string,
    accountId: string
): Promise<void> {
    try {
        const userAccountsKey = `user:${userID}:${CLOUD_ACCOUNTS_KEY}`
        const accounts = (await redisClient.json.get(
            userAccountsKey
        )) as unknown as RedisCloudAccount[]
        const newAccounts = accounts.filter(
            (account) => account.id !== accountId
        )

        await redisClient.json.set(userAccountsKey, "$", newAccounts)
    } catch (error) {
        console.error("Error removing cloud account:", error)
        throw error
    }
}


// Helper function to get databases from both subscription types
export async function getCloudDatabases(
    account: RedisCloudAccount,
    isFixed: boolean
): Promise<ServerWithStats[]> {
    const allDatabases: ServerWithStats[] = []

    const headers = {
        "x-api-key": account.accountKey,
        "x-api-secret-key": account.apiKey,
        "Content-Type": "application/json",
    }

    const subscriptionType = isFixed ? "fixed/" : ""
    const subscriptionsUrl = `https://api.redislabs.com/v1/${subscriptionType}subscriptions`

    // Fetch subscriptions for the account
    const subscriptionsResponse = await fetch(subscriptionsUrl, {
        method: "GET",
        headers: headers,
    })

    if (!subscriptionsResponse.ok) {
        throw new Error(
            `Failed to fetch subscriptions for account ${account.name}`
        )
    }

    const subscriptionsData = await subscriptionsResponse.json()

    if (!subscriptionsData.subscriptions.length) {
        console.log("No subscriptions found for account", account.name)
        return allDatabases
    } else { 
        console.log("GET \api\cloud-databases - read subscription count: ", subscriptionsData.subscriptions.length)
    }

    // Iterate over subscriptions
    for (const subscription of subscriptionsData.subscriptions) {
        const subscriptionId = subscription.id

        const databasesUrl = `https://api.redislabs.com/v1/${subscriptionType}subscriptions/${subscriptionId}/databases?offset=0&limit=100`

        // Fetch databases for each subscription
        const databasesResponse = await fetch(databasesUrl, {
            method: "GET",
            headers: headers,
        })

        if (!databasesResponse.ok) {
            throw new Error(
                `Failed to fetch databases for subscription ${subscriptionId}`
            )
        }

        const databasesData = await databasesResponse.json()

        const databases = isFixed
            ? databasesData.subscription?.databases || []
            : databasesData.subscription?.flatMap(
                  (subs: any) => subs.databases
              ) || []

        for (const db of databases) {
            // For fixed subscriptions, fetch full database details
            const dbDetails = await fetchDatabaseDetails(
                account,
                subscriptionId,
                db.databaseId,
                isFixed
            )
            console.log(`GET \api\cloud-databases\ ${isFixed ? "fixed" : "pro"} - DATABASE NAME: ${db.name}`)

            if (dbDetails) {
                
                const serverWithStats = mapDatabaseToServerWithStats(
                    account,
                    dbDetails
                )
                allDatabases.push(serverWithStats)
            }
        }
    }

    return allDatabases
}

// Fetch full database details
async function fetchDatabaseDetails(
    account: RedisCloudAccount,
    subscriptionId: number,
    databaseId: number,
    isFixed: boolean
) {
    const headers = {
        "x-api-key": account.accountKey,
        "x-api-secret-key": account.apiKey,
        "Content-Type": "application/json",
    }

    const subscriptionType = isFixed ? "fixed/" : ""
    const dbUrl = `https://api.redislabs.com/v1/${subscriptionType}subscriptions/${subscriptionId}/databases/${databaseId}`
    const dbResponse = await fetch(dbUrl, {
        method: "GET",
        headers: headers,
    })

    if (!dbResponse.ok) {
        console.error(
            `Failed to fetch database ${databaseId} for subscription ${subscriptionId}`
        )
        return null
    }

    return dbResponse.json()
}

// Map database data to ServerWithStats type
function mapDatabaseToServerWithStats(
    account: RedisCloudAccount,
    db: any
): ServerWithStats {

    // remove port from publicEndpoint 
    const [host, port] = db.publicEndpoint.split(":")

    const serverConfig: CloudServerConfig = {
        id: db.databaseId.toString(),
        name: db.name,
        host: host,
        port: Number(port),
        type: ServerType.CLOUD,
        cloudAccountId: account.id,
        databaseId: db.databaseId,
        password: db.security?.password ?? "",
        provider: "Redis Cloud",
        version: db.redisVersionCompliance,
        status: db.status,
        memoryUsedInMb: db.memoryUsedInMb,
        memoryLimitInGb: db.memoryLimitInGb,
        // Include other fields as necessary
    }

    return {
        config: serverConfig,
        stats: db,
        error: null,
        state: ServerState.SUCCESS,
    }
}
