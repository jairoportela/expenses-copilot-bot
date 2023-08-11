import notion from '../config/notion.js';
import config from '../config/config.js';

const getMyCategories = async () => {
  const { results } = await notion.databases.query({
    database_id: config.NOTION_CATEGORIES_DB_ID,
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
