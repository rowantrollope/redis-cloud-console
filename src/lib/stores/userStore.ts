// src/lib/stores/userStore.ts
import { writable } from "svelte/store"

export const userStore = writable<{ userID: string; refreshInterval: number }>({
    userID: "",
    refreshInterval: 30,
})

export async function initializeUserSettings(userID: string) {
    try {
        const response = await fetch("/api/usersettings")
        if (response.ok) {
            const settings = await response.json()
            userStore.set({
                userID,
                refreshInterval: settings.refreshInterval || 30,
            })
        } else {
            // If no settings exist yet, initialize with defaults
            userStore.set({
                userID,
                refreshInterval: 30,
            })
        }
    } catch (error) {
        console.error("Error fetching user settings:", error)
        // Initialize with defaults on error
        userStore.set({
            userID,
            refreshInterval: 30,
        })
    }
}