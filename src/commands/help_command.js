import {
  CreateExpenseCommandText,
  CreateIncomeCommandText,
} from '../constants/constants.js';

CreateExpenseCommandText;
const helpCommand = (ctx) => {
  const helpMessage = `
    Bienvenido al bot de finanzas. Aquí tienes una lista de comandos disponibles:
      
    /${CreateExpenseCommandText} - Crea un nuevo gasto.
    /${CreateIncomeCommandText} - Crea un nuevo ingreso.
    /resumen_mes - Muestra un resumen financiero del mes actual.
      
    ¡Espero que esta información te sea útil!
      `;

  ctx.reply(helpMessage);
};

export default helpCommand;
