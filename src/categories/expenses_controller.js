import notion from '../config/notion.js';
import config from '../config/config.js';
import { DateTime } from 'luxon';

// Función para extraer la información del mensaje
function getExpenseInfo(text) {
  const regex = /Nombre: (.+)\nValor: (.+)\nCategoría: (.+)/s;
  const match = text.match(regex);

  if (match) {
    const nombre = match[1];
    const valor = match[2];
    const categoria = match[3];

    return { nombre, valor, categoria };
  }

  return {};
}

const createExpense = async (messageText) => {
  const { nombre, valor, categoria } = getExpenseInfo(messageText);
  if (nombre && valor && categoria) {
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
                  content: nombre,
                },
              },
            ],
          },
          Amount: {
            type: 'number',
            number: parseInt(valor),
          },
          Categories: { relation: [{ id: categoria }] },
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
