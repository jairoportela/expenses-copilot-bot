import notion from '../config/notion.js';
import config from '../config/config.js';

export const getActualMonthId = async () => {
  const { results } = await notion.databases.query({
    database_id: config.notion.monthsTable,
    filter_properties: ['title'],
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
    database_id: config.notion.monthsTable,
    filter_properties: ['c%3Fq~', 'RTg_', 'yud%60', 'QEa~', 'title'],
    filter: {
      property: 'Actual Month',
      checkbox: {
        equals: true,
      },
    },
  });

  if (results.length == 0) return null;
  const pageId = results[0].id;

  const [totalExpensesData, totalIncomesData, balanceData] = await Promise.all([
    notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: 'c%3Fq~',
    }),
    notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: 'RTg_',
    }),
    notion.pages.properties.retrieve({
      page_id: pageId,
      property_id: 'yud%60',
    }),
  ]);

  const monthData = results[0].properties;
  return {
    month: monthData.Name.title[0].plain_text,
    totalExpenses: totalExpensesData.property_item.rollup.number ?? 0,
    totalIncomes: totalIncomesData.property_item.rollup.number ?? 0,
    balance: balanceData.formula.number ?? 0,
    budget: monthData.Budget.number ?? 0,
  };
};
