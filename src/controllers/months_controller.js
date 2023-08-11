import notion from '../config/notion.js';
import config from '../config/config.js';

const getActualMonthId = async () => {
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

export default getActualMonthId;
