import app from './app.js'; // Importación de app.js desde src/
import './database.js';      // Importación de database.js desde src/

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
