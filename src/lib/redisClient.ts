// src/lib/redisClient.ts
import { createClient } from 'redis';
import type { ServerConfig, ServerStats } from './types/types';
import type { RedisClientType, RedisClientOptions, RedisModules, RedisScripts, RedisDefaultModules } from 'redis';

interface ClientMap {
  [key: string]: RedisClientType<RedisDefaultModules, RedisScripts>;
}

const clients: ClientMap = {};

/**
 * Retrieves a Redis client. If it doesn't exist, it creates a new one.
 * @param id - A unique identifier for the Redis client.
 * @param options - Redis client options.
 * @returns A connected Redis client.
 */
export async function getRedisClient(
  id: string,
  options: RedisClientOptions<RedisModules, RedisScripts>
): Promise<RedisClientType<RedisDefaultModules, RedisScripts>> {
  if (!clients[id]) {
    const client: RedisClientType<RedisDefaultModules, RedisScripts> = createClient(options);
    await client.connect();
    clients[id] = client;
  }
  return clients[id];
}

/**
 * Disconnects and removes a Redis client.
 * @param id - The unique identifier of the Redis client to disconnect.
 */
export async function disconnectRedisClient(id: string): Promise<void> {
  if (clients[id]) {
    await clients[id].quit();
    delete clients[id];
  }
}
export async function readRedisInfo(
    config: ServerConfig
): Promise<ServerStats> {
    try {
        const client = createClient({
            socket: {
                host: config.host,
                port: config.port,
            },
            password: config.password,
        })

        await client.connect()

        const infoRaw = await client.info()
        const stats = parseRedisInfo(infoRaw)

        await client.disconnect()

        return stats
    } catch (err) {
        console.error(`Error connecting to Redis server ${config.name}:`, err)
        throw err
    }
}

export function parseRedisInfo(info: string): ServerStats {
    const lines = info.split("\r\n")
    const data: ServerStats = {}
    for (const line of lines) {
        if (line && !line.startsWith("#")) {
            const [key, value] = line.split(":")
            if (key && value !== undefined) {
                data[key] = value
            }
        }
    }
    return data
}
