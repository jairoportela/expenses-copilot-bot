import notion from '../config/notion.js';
import config from '../config/config.js';
import { DateTime } from 'luxon';

// Función para extraer la información del mensaje

const createExpense = async ({ name, value, category }) => {
  if (name && value && category) {
    try {
      // Crea una instancia de DateTime en el timezone de Bogotá
      const bogotaDateTime = DateTime.now().setZone('America/Bogota');

      // Formatea la fecha en formato ISO
      const isoDate = bogotaDateTime.toISO();
      const data = await notion.pages.create({
        parent: {
          database_id: config.NOTION_EXPENSES_DB_ID,
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
          Date: { date: { start: isoDate } },
        },
      });
      console.log('Gasto registrado en Notion:', data);
      return 'Gasto registrado correctamente en Notion. ✅';
    } catch (error) {
      console.log(error);
      return 'Hubo un error al registrar el gasto en Notion. ❌';
    }
  } else {
    return 'Por favor, utiliza el comando /registro y sigue el formato correcto.';
  }
};

export default createExpense;