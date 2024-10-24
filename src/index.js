import serverless from 'serverless-http';
import app from './app.js'; // Importación de app.js desde src/
import './database.js';      // Importación de database.js desde src/

// Exportar la app utilizando serverless-http para que Vercel lo maneje correctamente
export const handler = serverless(app);
