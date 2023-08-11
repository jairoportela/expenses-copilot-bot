const config = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TELEGRAM_USER_ID: process.env.TELEGRAM_USER_ID,
  WEBHOOK_DOMAIN: process.env.WEBHOOK_DOMAIN,
  PORT: process.env.PORT,
  NOTION_KEY: process.env.NOTION_KEY,
  NOTION_CATEGORIES_DB_ID: process.env.NOTION_CATEGORIES_DB_ID,
  NOTION_EXPENSES_DB_ID: process.env.NOTION_EXPENSES_DB_ID,
  NOTION_MONTHS_DB_ID: process.env.NOTION_MONTHS_DB_ID,
  NOTION_PAYMENTHS_METHODS_DB_ID: process.env.NOTION_PAYMENTHS_METHODS_DB_ID,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  },
};

export default config;
