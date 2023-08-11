import { createClient } from 'redis';
import config from './config.js';
const client = createClient({
  url: config.redis.url,
  password: config.redis.password, // Aquí proporciona la contraseña directamente
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

export default client;
