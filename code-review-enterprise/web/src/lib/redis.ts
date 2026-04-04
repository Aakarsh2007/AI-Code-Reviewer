import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType> {
  if (client?.isOpen) return client;

  client = createClient({ url: process.env.REDIS_URI }) as RedisClientType;
  client.on("error", (err) => console.error("[Redis]", err));
  await client.connect();
  return client;
}
