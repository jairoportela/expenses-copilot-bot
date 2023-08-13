import { Client } from '@notionhq/client';
import config from '../config/config.js';

// Initializing a client
const notion = new Client({
  auth: config.notion.key,
});

export default notion;
