import notion from '../config/notion.js';
import config from '../config/config.js';

const getMyCategories = async ({ type }) => {
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

  return categories;
};

export default getMyCategories;
