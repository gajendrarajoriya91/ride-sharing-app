import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const client: RedisClientType = createClient({
  url: process.env.REDIS_URI,
});

client
  .connect()
  .then(() => {
    console.log('Successfully connected to Redis');
  })
  .catch((err: Error) => {
    console.error('Error connecting to Redis:', err);
  });

client.on('error', (err: Error) => {
  console.error('Redis error:', err);
});

export default client;
