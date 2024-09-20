// src/lib/server/servers.ts
import fs from "fs/promises"
import path from "path"
import type { ServerConfig } from "../types/types"

const serversFilePath = path.resolve("src/data/servers.json")

export async function getServerConfigs(): Promise<ServerConfig[]> {
    try {
        const data = await fs.readFile(serversFilePath, "utf-8")
        return JSON.parse(data) as ServerConfig[]
    } catch (error) {
        console.error("Error reading server configurations:", error)
        return []
    }
}

export async function addServerConfig(config: ServerConfig): Promise<void> {
    const configs = await getServerConfigs()
    configs.push(config)
    await fs.writeFile(serversFilePath, JSON.stringify(configs, null, 2))
}

export async function removeServerConfig(id: string): Promise<void> {
    const configs = await getServerConfigs()
    const updatedConfigs = configs.filter((config) => config.id !== id)
    await fs.writeFile(serversFilePath, JSON.stringify(updatedConfigs, null, 2))
}

export async function updateServerConfig(
    updatedConfig: ServerConfig
): Promise<void> {
    const configs = await getServerConfigs()
    const index = configs.findIndex((config) => config.id === updatedConfig.id)
    if (index !== -1) {
        configs[index] = updatedConfig
        await fs.writeFile(serversFilePath, JSON.stringify(configs, null, 2))
    } else {
        throw new Error(
            `Server configuration with id ${updatedConfig.id} not found`
        )
    }
}
