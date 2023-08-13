import {
  CreateExpenseCommandText,
  CreateIncomeCommandText,
  MonthSummaryCommandText,
} from '../constants/constants.js';

const helpCommand = (ctx) => {
  const helpMessage = `
    Bienvenido al bot de finanzas. Aquí tienes una lista de comandos disponibles:
      
    /${CreateExpenseCommandText} - Crea un nuevo gasto.
    /${CreateIncomeCommandText} - Crea un nuevo ingreso.
    /${MonthSummaryCommandText} - Muestra un resumen financiero del mes actual.
      
    ¡Espero que esta información te sea útil!
      `;

  ctx.reply(helpMessage);
};

export default helpCommand;
