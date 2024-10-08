// src/lib/services/redisCloudServerService.ts
import { get } from "svelte/store"
import { userStore } from "$lib/stores/userStore"

const BASE_URL = "http://localhost:8080"

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

export async function fetchRemoteServerStats(databaseId: string) {
    const response = await fetch(
        `${BASE_URL}/stats?id=${databaseId}`
    )
    console.log("fetchRemoteServerStats response", response)
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
            errorData.error || "Failed to fetch remote server stats."
        )
    }
    const data = response.json()
    console.log("Loaded stats for server: %s", data)
    return data
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
