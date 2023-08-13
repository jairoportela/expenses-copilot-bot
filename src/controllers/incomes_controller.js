import notion from '../config/notion.js';
import config from '../config/config.js';
import { DateTime } from 'luxon';
import { getActualMonthId } from './months_controller.js';
import { CreateIncomeCommandText } from '../constants/constants.js';

// Función para extraer la información del mensaje

const createIncome = async ({ name, value, category }) => {
  if (name && value && category) {
    try {
      // Crea una instancia de DateTime en el timezone de Bogotá
      const bogotaDateTime = DateTime.now().setZone('America/Bogota');
      const actualMonth = await getActualMonthId();

      // Formatea la fecha en formato ISO
      const isoDate = bogotaDateTime.toISO();
      const data = await notion.pages.create({
        parent: {
          database_id: config.notion.incomesTable,
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
        },
      });
      console.log('Ingreso registrado en Notion ✅');
      return 'Ingreso registrado correctamente en Notion. ✅';
    } catch (error) {
      console.log(error);
      return 'Hubo un error al registrar el ingreso en Notion. ❌';
    }
  } else {
    return `El formato utilizado no es el correcto, vuelve a empezar el flujo usando el comando /${CreateIncomeCommandText}.`;
  }
};

export default createIncome;
