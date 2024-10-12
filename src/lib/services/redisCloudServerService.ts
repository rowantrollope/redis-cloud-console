// src/lib/services/redisCloudServerService.ts
import { get } from "svelte/store"
import { userStore } from "$lib/stores/userStore"

const BASE_URL = "https://redis-proxy-server.onrender.com"

export async function activationClaim(activationCode: string) {
    const accountID = get(userStore).userID
    const response = await fetch(
        `${BASE_URL}/activation/claim?activationCode=${activationCode}&accountID=${accountID}`
    )

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Activation claim failed.")
    }

    return response.json()
}

export async function fetchRemoteServers(userID: string) {
    const accountID = userID
    const response = await fetch(`${BASE_URL}/servers?accountID=${accountID}`)

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch remote servers.")
    }

    return response.json()
}

export async function fetchRemoteServer(databaseId: string) {
    const response = await fetch(
        `${BASE_URL}/stats?id=${databaseId}`
    )
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
            errorData.error || "Failed to fetch remote server stats."
        )
    }
    const data = await response.json()
    console.log("fetchRemoteServer response", data)
    return data
}
export async function removeRemoteServer(databaseId: string) {
    const response = await fetch(`${BASE_URL}/activation/deactivate?redisServerId=${databaseId}`, {
        method: "DELETE",
    })
    console.log("removeRemoteServer")

    if (!response.ok) {
        throw new Error(response.statusText || "Failed to remove remote server.")
    }

    return 
}
export async function sendCommandToRemoteServer(
    databaseUUID: string,
    command: string
) {
    const response = await fetch(`${BASE_URL}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseUUID, command }),
    })

    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to send command.")
    }

    return response.json()
}
