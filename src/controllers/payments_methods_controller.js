import notion from '../config/notion.js';
import config from '../config/config.js';

const getMyPaymentMethods = async () => {
  const { results } = await notion.databases.query({
    database_id: config.NOTION_PAYMENTHS_METHODS_DB_ID,
  });

  const paymentsMethods = results.map((paymentMethod) => {
    return {
      name: paymentMethod.properties.Name.title[0].text.content,
      id: paymentMethod.id,
    };
  });

  return paymentsMethods;
};

export default getMyPaymentMethods;
