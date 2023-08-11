import notion from '../config/notion.js';
import config from '../config/config.js';
import redisClient from '../config/redis.js';

const categoriesKey = 'categories';

const getMyCategories = async ({ type }) => {
  const data = await redisClient.get(categoriesKey);
  console.log('Categorias redis: ', data);
  if (data) {
    return JSON.parse(data);
  }

  const { results } = await notion.databases.query({
    database_id: config.NOTION_CATEGORIES_DB_ID,
    filter: {
      property: 'Type', // Propiedad que indica el tipo de categoría
      select: {
        equals: type, // Valor para filtrar las categorías de tipo "Expenses"
      },
    },
  });

  const categories = results.map((category) => {
    return {
      name: category.properties.Name.title[0].text.content,
      id: category.id,
    };
  });

  await redisClient.setEx(categoriesKey, 86400, JSON.stringify(categories));
  return categories;
};

export default getMyCategories;
