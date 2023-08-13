import 'dotenv/config';
import config from './config/config.js';
import { Telegraf, Markup, session } from 'telegraf';
import { message } from 'telegraf/filters';
import express from 'express';

import { getExpensesCategories } from './controllers/categories_controller.js';
import helpCommand from './commands/help_command.js';
import startCommand from './commands/start_command.js';
import summaryMonthCommand from './commands/summary_month_command.js';
import {
  createCategoriesKeyboard,
  createDataCommand,
  selectCategoryAction,
  selectPaymentMethodAction,
} from './commands/create_data_command.js';

import isValidUser from './utils/valid_user.js';
import {
  CreateExpenseCommandText,
  CreateIncomeCommandText,
} from './constants/constants.js';

const port = Number(config.PORT) || 3000;
if (!config.telegram.botToken)
  throw new Error('"BOT_TOKEN" env var is required!');

const bot = new Telegraf(config.telegram.botToken);
bot.use(session());

const app = express();

bot.start(startCommand);

bot.command('help', helpCommand);

//Start the create expense flow
bot.command('resumen_mes', summaryMonthCommand);

bot.command(CreateExpenseCommandText, (ctx) =>
  createDataCommand(ctx, CreateExpenseCommandText)
);
bot.command(CreateIncomeCommandText, (ctx) =>
  createDataCommand(ctx, CreateIncomeCommandText)
);
//Manage the create expense flow
bot.on(message('text'), async (ctx) => {
  if (!isValidUser) return;
  const chatId = ctx.from.id;
  const message = ctx.message.text;
  const currentFlow = ctx.session?.currentFlow ?? '';

  if (currentFlow.length == 0) {
    return ctx.reply(
      'No has empezado ningún flujo, escribe / para ver los comandos disponibles.'
    );
  }

  if (ctx.session[chatId].name === undefined) {
    ctx.session[chatId].name = message;
    ctx.reply('Ahora escribe el valor del gasto:');
  } else if (ctx.session[chatId].value === undefined) {
    ctx.session[chatId].value = message;
    const keyboard = await createCategoriesKeyboard(ctx);
    ctx.reply('Selecciona una categoría:', keyboard);
  }
});

//Select category
bot.action(/select_category:(.*)/, selectCategoryAction);
//Select and paymenth method

bot.action(/select_payment:(.*)/, selectPaymentMethodAction);

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

app.get('/', (_, res) => res.send('Ok'));

app.listen(port, () => console.log('Listening on port', port));
