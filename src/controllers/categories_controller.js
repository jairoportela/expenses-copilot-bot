import notion from '../config/notion.js';
import config from '../config/config.js';
import redisClient from '../config/redis.js';

const expensesCategoriesKey = 'expenses_categories';
const incomesCategoriesKey = 'incomes_categories';

export const getExpensesCategories = async () => {
  const data = await redisClient.get(expensesCategoriesKey);
  if (data) {
    return JSON.parse(data);
  }

  const { results } = await notion.databases.query({
    database_id: config.notion.expensesCategoriesTable,
    filter_properties: ['title'],
  });

  const categories = results.map((category) => {
    return {
      name: category.properties.Name.title[0].text.content,
      id: category.id,
    };
  });

  await redisClient.setEx(
    expensesCategoriesKey,
    86400,
    JSON.stringify(categories)
  );
  return categories;
};
export const getIncomesCategories = async () => {
  const data = await redisClient.get(incomesCategoriesKey);
  if (data) {
    return JSON.parse(data);
  }

  const { results } = await notion.databases.query({
    database_id: config.notion.incomesCategoriesTable,
    filter_properties: ['title'],
  });

  const categories = results.map((category) => {
    return {
      name: category.properties.Name.title[0].text.content,
      id: category.id,
    };
  });

  await redisClient.setEx(
    incomesCategoriesKey,
    86400,
    JSON.stringify(categories)
  );
  return categories;
};
