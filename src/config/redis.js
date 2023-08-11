import { createClient } from 'redis';
import config from './config.js';
const client = createClient({
  url: `redis://default:${config.redis.password}@${config.redis.host}:${config.redis.port}`,
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password, // Aquí proporciona la contraseña directamente
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

export default client;
