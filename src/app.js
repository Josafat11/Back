import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

// Importación de las rutas desde src/routes
import user from './routes/User.routes.js'; // Ruta correcta para las rutas
import prueba from './routes/prueba.js';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde src/public
app.use(express.static('src/public'));

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to petApi',
    });
});

// Rutas
app.use('/api/auth', user);
app.use('/api/users', prueba);

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta incorrecta' });
});

export default app;
