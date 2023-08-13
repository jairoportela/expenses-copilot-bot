import notion from '../config/notion.js';
import config from '../config/config.js';
import redisClient from '../config/redis.js';

const paymentKey = 'paymentsMethods';

const getMyPaymentMethods = async () => {
  const data = await redisClient.get(paymentKey);
  if (data) {
    return JSON.parse(data);
  }
  const { results } = await notion.databases.query({
    database_id: config.notion.paymentsMethodsTable,
  });

  const paymentsMethods = results.map((paymentMethod) => {
    return {
      name: paymentMethod.properties.Name.title[0].text.content,
      id: paymentMethod.id,
    };
  });

  await redisClient.setEx(paymentKey, 86400, JSON.stringify(paymentsMethods));

  return paymentsMethods;
};

export default getMyPaymentMethods;
