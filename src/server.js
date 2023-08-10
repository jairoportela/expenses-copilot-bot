import 'dotenv/config';
import config from './config/config.js';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import express from 'express';

import getMyCategories from './categories/categories_controller.js';
import createExpense from './categories/expenses_controller.js';

const port = Number(config.PORT) || 3000;
if (!config.TELEGRAM_BOT_TOKEN)
  throw new Error('"BOT_TOKEN" env var is required!');

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);
const app = express();

bot.start((ctx) =>
  ctx.reply('Bienvenido al nuevo sistema de registro de gastos 💰')
);
bot.help((ctx) => ctx.reply('Send me a sticker'));

bot.command('categorias', async (ctx) => {
  const chatId = ctx.from.id;
  if (chatId != config.TELEGRAM_USER_ID) return errorResponse(ctx);
  ctx.reply('Estamos procesando tu solicitud ⏲️');

  ctx.replyWithHTML(await getMyCategories());
});

bot.command('registro', (ctx) => {
  const chatId = ctx.from.id;
  if (chatId != config.TELEGRAM_USER_ID) return errorResponse(ctx);
  ctx.reply(
    'Por favor, envíame el nombre del gasto, el valor y la categoría en el siguiente formato:\n\nNombre: <nombre_gasto>\nValor: <valor>\nCategoría: <categoria>'
  );
});
bot.on(message('text'), async (ctx) => {
  const chatId = ctx.from.id;
  if (chatId != config.TELEGRAM_USER_ID) return errorResponse(ctx);
  ctx.reply('Estamos procesando tu solicitud ⏲️');
  const messageText = ctx.message.text;
  ctx.replyWithHTML(await createExpense(messageText));
});

const errorResponse = (ctx) =>
  ctx.reply('No tienes permisos para usar este bot ❌');

bot.launch();

app.get('/', (req, res) => res.send('Ok'));

app.listen(port, () => console.log('Listening on port', port));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
