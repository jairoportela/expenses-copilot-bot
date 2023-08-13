import isValidUser from '../utils/valid_user.js';
import { getActualMonthData } from '../controllers/months_controller.js';
import { Markup } from 'telegraf';

function formatNumberWithCommas(number) {
  const floorNumber = Math.floor(number);
  return floorNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

const summaryMonthCommand = async (ctx) => {
  if (!isValidUser(ctx)) return;

  const info = await getActualMonthData();
  const isExceedingBudget = info.balance < 0;

  const formattedInfo = `
  <b>Información Financiera\n${info.month}</b>\n
  Total gastos: $ ${formatNumberWithCommas(info.totalExpenses)}
  Total ingresos: $ ${formatNumberWithCommas(info.totalIncomes)}
  Balance: $ ${formatNumberWithCommas(info.balance)}
  Presupuesto: $ ${formatNumberWithCommas(info.budget)}${
    isExceedingBudget ? ' ⚠️' : ' ✅'
  }
  `;

  ctx.replyWithHTML(formattedInfo, Markup.removeKeyboard());
};

export default summaryMonthCommand;
