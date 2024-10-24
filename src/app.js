import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from './database.js';

// Importación de las rutas
import user from './routes/User.routes.js';
import prueba from './routes/prueba.js';
import politicas from './routes/Politicas.routes.js';
import terminos from './routes/Terminos.routes.js';
import deslinde from './routes/Deslinde.routes.js';

const app = express();

// List of allowed origins
const allowedOrigins = [
    'http://localhost:3000', 
    'https://front-jose-josafats-projects.vercel.app', // Asegúrate de que esta sea la URL de tu frontend en producción
    'https://back-steel-iota.vercel.app' // URL del backend en producción
];

// CORS middleware configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Necesario para enviar cookies
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions)); // Habilitar CORS con las opciones definidas
app.options('*', cors(corsOptions)); // Permitir preflight (opciones) para todas las rutas

// Configuración de sesiones
app.use(session({
    secret: 'mi_secreto_seguro',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/Refaccionaria',
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60,
        sameSite: 'strict'
    }
}));

// Rutas
app.use('/api/auth', user);
app.use('/api/users', prueba);
app.use('/api/docs', politicas);
app.use('/api/docs', terminos);
app.use('/api/docs', deslinde);

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta incorrecta' });
});

export default app;
