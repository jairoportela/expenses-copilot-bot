import 'dotenv/config';
import config from './config/config.js';
import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import express from 'express';

import getMyCategories from './controllers/categories_controller.js';
import getMyPaymentMethods from './controllers/payments_methods_controller.js';
import createExpense from './controllers/expenses_controller.js';

const port = Number(config.PORT) || 3000;
if (!config.TELEGRAM_BOT_TOKEN)
  throw new Error('"BOT_TOKEN" env var is required!');

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

const expensesByUser = {};

const app = express();

bot.start((ctx) =>
  ctx.reply('Bienvenido al nuevo sistema de registro de gastos 💰')
);

//Start the create expense flow
bot.command('crear_gasto', (ctx) => {
  const chatId = ctx.from.id;
  if (chatId != config.TELEGRAM_USER_ID) return errorResponse(ctx);
  expensesByUser[chatId] = {}; // Inicializa el estado de la conversación

  ctx.reply('Por favor, escribe el nombre del gasto:');
});

//Manage the create expense flow
bot.on(message('text'), async (ctx) => {
  const chatId = ctx.from.id;
  if (chatId != config.TELEGRAM_USER_ID) return errorResponse(ctx);

  const message = ctx.message.text;
  if (expensesByUser[chatId].name === undefined) {
    expensesByUser[chatId].name = message;
    ctx.reply('Ahora escribe el valor del gasto:');
  } else if (expensesByUser[chatId].value === undefined) {
    expensesByUser[chatId].value = message;
    const categories = await getMyCategories({ type: 'Expenses' });
    const keyboard = Markup.inlineKeyboard(
      categories.map((category) => {
        return [
          Markup.button.callback(
            category.name,
            `select_category:${category.id}`
          ),
        ];
      })
    );

    ctx.reply('Selecciona una categoría:', keyboard);
  } else if (expensesByUser[chatId].categoria === undefined) {
    expensesByUser[chatId].category = message;

    ctx.reply(await createExpense(expensesByUser[chatId]));
    delete expensesByUser[userId]; // Limpia el estado de la conversación
  }
});

//Select category
bot.action(/select_category:(.*)/, async (ctx) => {
  const chatId = ctx.from.id;

  if (chatId != config.TELEGRAM_USER_ID) return errorResponse(ctx);
  const category = ctx.match[1];
  expensesByUser[chatId].category = category;
  ctx.telegram.editMessageText(
    chatId,
    ctx.callbackQuery.message.message_id,
    null,
    'Has seleccionado la categoría con ID: ' + category
  );
  const paymentMethods = await getMyPaymentMethods();
  const keyboard = Markup.inlineKeyboard(
    paymentMethods.map((paymentMethod) => {
      return [
        Markup.button.callback(
          paymentMethod.name,
          `select_payment:${paymentMethod.id}`
        ),
      ];
    })
  );

  ctx.reply('Selecciona una método de pago:', keyboard);
});
//Select and paymenth method

bot.action(/select_payment:(.*)/, async (ctx) => {
  const chatId = ctx.from.id;

  if (chatId != config.TELEGRAM_USER_ID) return errorResponse(ctx);
  const paymentMethod = ctx.match[1];
  expensesByUser[chatId].paymentMethod = paymentMethod;
  ctx.telegram.editMessageText(
    chatId,
    ctx.callbackQuery.message.message_id,
    null,
    'Has seleccionado el método de pago con ID: ' + paymentMethod
  );

  ctx.reply(await createExpense(expensesByUser[chatId]));
  delete expensesByUser[chatId]; // Limpia el estado de la conversación
});

const errorResponse = (ctx) =>
  ctx.reply('No tienes permisos para usar este bot ❌');

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

app.get('/', (_, res) => res.send('Ok'));

app.listen(port, () => console.log('Listening on port', port));
