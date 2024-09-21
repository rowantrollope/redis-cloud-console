// src/lib/server/servers.ts
import { redisClient } from "$lib/redisClient"
import type { ServerConfig } from "../types/types"
import crypto from "crypto"

const SERVER_CONFIGS_KEY = "server_configs"
const SERVER_CONFIG_KEY = "server_config"

// Securely store this key, do NOT hard-code in production
const ENCRYPTION_KEY =
    process.env.ENCRYPTION_KEY || "testtesttesttesttesttesttest" // Must be 32 bytes for AES-256
const IV_LENGTH = 16 // For AES, this is always 16

function encrypt(text: string): string {
    let iv = crypto.randomBytes(IV_LENGTH)
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let encrypted = cipher.update(text)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decrypt(text: string): string {
    let textParts = text.split(':')
    let iv = Buffer.from(textParts.shift() as string, 'hex')
    let encryptedText = Buffer.from(textParts.join(':'), 'hex')
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
}

/**
 * Retrieves all server configurations for a specific user from Redis.
 * @param {string} userID - The ID of the user.
 * @returns {Promise<ServerConfig[]>} Array of server configurations.
 */
export async function getServerConfigs(userID: string): Promise<ServerConfig[]> {
    // Hash the userID to retrieve records
    const userKey = `user:${userID}:${SERVER_CONFIGS_KEY}`
    const data = await redisClient.sMembers(userKey)

    if (data.length === 0) {
        return []
    }
    let serverConfigs = []
    try {
        serverConfigs = await redisClient.json.mGet(data, "$")
    } catch (error) {
        console.error("Error getting server configurations from Redis:", error)
        return []
    }

    // Decrypt passwords after retrieval
    const decryptedConfigs = serverConfigs.flat().map(config => {
        if (
            typeof config === 'object' &&
            config !== null &&
            'password' in config &&
            typeof config.password === 'string' &&
            config.password.length > 0
        ) {
            console.log("decrypting password", config.password)
            config.password = decrypt(config.password)
        }
        return config
    })

    return decryptedConfigs || []
}

/**
 * Adds a new server configuration for a specific user to Redis.
 * @param {string} userID - The ID of the user.
 * @param {ServerConfig} config - The server configuration to add.
 */
export async function addServerConfig(userID: string, config: ServerConfig): Promise<void> {
    try {
        // Encrypt the password before storing
        if (config.password) {
            config.password = encrypt(config.password)
        }

        // Hash the userID to use as an identifier
        const configKey = `user:${userID}:${SERVER_CONFIG_KEY}:${config.id}`
        const userKey = `user:${userID}:${SERVER_CONFIGS_KEY}`

        await redisClient.json.set(configKey, '$', config)
        await redisClient.sAdd(userKey, configKey)
        console.log(`addServerConfig for user ${userID}`, config)
    } catch (error) {
        console.error("Error adding server configuration to Redis:", error)
        throw error
    }
}

/**
 * Removes a server configuration for a specific user from Redis.
 * @param {string} userID - The ID of the user.
 * @param {string} id - The ID of the server configuration to remove.
 */
export async function removeServerConfig(userID: string, id: string): Promise<void> {
    try {
        const configKey = `user:${userID}:${SERVER_CONFIG_KEY}:${id}`
        const userKey = `user:${userID}:${SERVER_CONFIGS_KEY}`

        await redisClient.json.del(configKey)
        await redisClient.sRem(userKey, configKey)
    } catch (error) {
        console.error("Error removing server configuration from Redis:", error)
        throw error
    }
}

/**
 * Updates an existing server configuration for a specific user in Redis.
 * @param {string} userID - The ID of the user.
 * @param {ServerConfig} updatedConfig - The updated server configuration.
 */
export async function updateServerConfig(userID: string, updatedConfig: ServerConfig): Promise<void> {
    try {
        const configKey = `user:${userID}:${SERVER_CONFIG_KEY}:${updatedConfig.id}`

        const exists = await redisClient.json.get(configKey)
        if (exists) {
            await redisClient.json.set(configKey, '$', updatedConfig)
        } else {
            throw new Error(
                `Server configuration with id ${updatedConfig.id} for user ${userID} not found`
            )
        }
    } catch (error) {
        console.error("Error updating server configuration in Redis:", error)
        throw error
    }
}
