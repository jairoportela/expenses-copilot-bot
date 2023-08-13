const helpCommand = (ctx) => {
  const helpMessage = `
    Bienvenido al bot de finanzas. Aquí tienes una lista de comandos disponibles:
      
    /crear_gasto - Crea un nuevo gasto.
    /resumen_mes - Muestra un resumen financiero del mes actual.
      
    ¡Espero que esta información te sea útil!
      `;

  ctx.reply(helpMessage);
};

export default helpCommand;
