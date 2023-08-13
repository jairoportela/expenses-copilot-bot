import { Markup } from 'telegraf';

import isValidUser from '../utils/valid_user.js';
import getMyPaymentMethods from '../controllers/payments_methods_controller.js';
import createExpense from '../controllers/expenses_controller.js';
import createIncome from '../controllers/incomes_controller.js';
import {
  CreateExpenseCommandText,
  CreateIncomeCommandText,
} from '../constants/constants.js';
import {
  getExpensesCategories,
  getIncomesCategories,
} from '../controllers/categories_controller.js';
import flowMessageGetter from '../utils/flow_message_getter.js';

export const createDataCommand = (ctx, flow) => {
  if (!isValidUser(ctx)) return;
  const chatId = ctx.from.id;

  ctx.session = { currentFlow: flow };
  ctx.session[chatId] = {};

  ctx.reply(`Por favor, escribe el nombre del ${flowMessageGetter(flow)}:`);
};

export const selectCategoryAction = async (ctx) => {
  if (!isValidUser(ctx)) return;
  const chatId = ctx.from.id;
  const category = ctx.match[1];
  ctx.session[chatId].category = category;
  ctx.telegram.editMessageText(
    chatId,
    ctx.callbackQuery.message.message_id,
    null,
    'Has seleccionado la categoría con ID: ' + category
  );

  if (ctx.session.currentFlow == CreateExpenseCommandText) {
    const keyboard = await createPaymentMethodsKeyboard();
    ctx.reply('Selecciona una método de pago:', keyboard);
  }
  if (ctx.session.currentFlow == CreateIncomeCommandText) {
    ctx.reply(await createIncome(ctx.session[chatId]));
    delete ctx.session[chatId];
  }
};
export const selectPaymentMethodAction = async (ctx) => {
  if (!isValidUser(ctx)) return;
  const chatId = ctx.from.id;
  const paymentMethod = ctx.match[1];
  ctx.session[chatId].paymentMethod = paymentMethod;

  ctx.telegram.editMessageText(
    chatId,
    ctx.callbackQuery.message.message_id,
    null,
    'Has seleccionado el método de pago con ID: ' + paymentMethod
  );

  ctx.reply(await createExpense(ctx.session[chatId]));
  delete ctx.session[chatId]; // Limpia el estado de la conversación
};

const _getCategories = async (currentFlow) => {
  try {
    if (currentFlow == CreateExpenseCommandText) {
      return await getExpensesCategories();
    } else if (currentFlow == CreateIncomeCommandText) {
      return await getIncomesCategories();
    }
    return [];
  } catch (error) {
    return [];
  }
};

export const createCategoriesKeyboard = async (ctx) => {
  const categories = await _getCategories(ctx.session.currentFlow);
  const keyboard = Markup.inlineKeyboard(
    categories.map((category) => {
      return [
        Markup.button.callback(category.name, `select_category:${category.id}`),
      ];
    })
  );
  return keyboard;
};
export const createPaymentMethodsKeyboard = async () => {
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
  return keyboard;
};
