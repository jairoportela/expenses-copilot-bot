const config = {
  PORT: process.env.PORT,
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    userId: process.env.TELEGRAM_USER_ID,
  },
  notion: {
    key: process.env.NOTION_KEY,
    expensesTable: process.env.NOTION_EXPENSES_DB_ID,
    incomesTable: process.env.NOTION_INCOMES_DB_ID,
    expensesCategoriesTable: process.env.NOTION_CATEGORIES_EXPENSES_DB_ID,
    incomesCategoriesTable: process.env.NOTION_CATEGORIES_INCOMES_DB_ID,
    monthsTable: process.env.NOTION_MONTHS_DB_ID,
    paymentsMethodsTable: process.env.NOTION_PAYMENTHS_METHODS_DB_ID,
  },
  redis: {
    url: process.env.REDIS_URL,

    password: process.env.REDIS_PASSWORD,
  },
};

export default config;
