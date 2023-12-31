import notion from '../config/notion.js';
import config from '../config/config.js';
import { DateTime } from 'luxon';
import { getActualMonthId } from './months_controller.js';
import { CreateExpenseCommandText } from '../constants/constants.js';

// Función para extraer la información del mensaje

const createExpense = async ({ name, value, category, paymentMethod }) => {
  if (name && value && category && paymentMethod) {
    try {
      // Crea una instancia de DateTime en el timezone de Bogotá
      const bogotaDateTime = DateTime.now().setZone('America/Bogota');
      const actualMonth = await getActualMonthId();

      // Formatea la fecha en formato ISO
      const isoDate = bogotaDateTime.toISO();
      const data = await notion.pages.create({
        parent: {
          database_id: config.notion.expensesTable,
        },
        properties: {
          Name: {
            type: 'title',
            title: [
              {
                type: 'text',
                text: {
                  content: name,
                },
              },
            ],
          },
          Amount: {
            type: 'number',
            number: parseInt(value),
          },
          Categories: { relation: [{ id: category }] },
          Month: { relation: [{ id: actualMonth }] },
          Date: { date: { start: isoDate } },
          'Payment Methods': { relation: [{ id: paymentMethod }] },
        },
      });
      console.log('Gasto registrado en Notion ✅');
      return 'Gasto registrado correctamente en Notion. ✅';
    } catch (error) {
      console.log(error);
      return 'Hubo un error al registrar el gasto en Notion. ❌';
    }
  } else {
    return `El formato utilizado no es el correcto, vuelve a empezar el flujo usando el comando /${CreateExpenseCommandText}.`;
  }
};

export default createExpense;
