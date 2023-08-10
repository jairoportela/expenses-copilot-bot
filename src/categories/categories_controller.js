import notion from '../config/notion.js';
import config from '../config/config.js';

const getMyCategories = async () => {
  const { results: categories } = await notion.databases.query({
    database_id: config.NOTION_CATEGORIES_DB_ID,
  });
  let message = '<b>Categorías disponibles:</b>\n\n';

  categories.forEach((category) => {
    console.log(category);
    message += `- <b>Nombre:</b> ${category.properties.Name.title[0].text.content} | <b>ID:</b> ${category.id}\n`;
  });

  return message;
};

export default getMyCategories;
