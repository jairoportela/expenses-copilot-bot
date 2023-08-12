import notion from '../config/notion.js';
import config from '../config/config.js';

export const getActualMonthId = async () => {
  const { results } = await notion.databases.query({
    database_id: config.NOTION_MONTHS_DB_ID,
    filter: {
      property: 'Actual Month',
      checkbox: {
        equals: true,
      },
    },
  });
  if (results.length > 0) return results[0].id;
  return null;
};

export const getActualMonthData = async () => {
  const { results } = await notion.databases.query({
    database_id: config.NOTION_MONTHS_DB_ID,
    filter: {
      property: 'Actual Month',
      checkbox: {
        equals: true,
      },
    },
  });

  if (results.length == 0) return null;

  const monthData = results[0].properties;

  return {
    month: monthData.Name.title[0].plain_text,
    totalExpenses: monthData['Total Expenses']['rollup']['number'] ?? 0,
    totalIncomes: monthData['Total Incomes']['rollup']['number'] ?? 0,
    balance: monthData.Balance.formula.number ?? 0,
    budget: monthData.Budget.number ?? 0,
  };
};
