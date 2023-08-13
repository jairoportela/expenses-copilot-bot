import config from '../config/config.js';

const isValidUser = (ctx) => {
  const chatId = ctx.from.id;
  if (chatId == config.TELEGRAM_USER_ID) return true;
  ctx.reply('No tienes permisos para usar este bot ❌');
  return false;
};

export default isValidUser;
