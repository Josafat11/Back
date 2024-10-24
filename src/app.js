import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session'; 
import MongoStore from 'connect-mongo'; 
import mongoose from './database.js'; 

// Importación de las rutas desde src/routes
import user from './routes/User.routes.js'; 
import prueba from './routes/prueba.js';
import politicas from './routes/Politicas.routes.js';
import terminos from './routes/Terminos.routes.js';
import deslinde from './routes/Deslinde.routes.js';

const app = express();

// Lista blanca de orígenes permitidos
const listWhite = [
    'http://localhost:3000',  // Frontend en desarrollo
    'https://frontend-five-roan-17.vercel.app' // Frontend en producción
];

// Configuración de CORS
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || listWhite.indexOf(origin) !== -1) {
            callback(null, true); // Permitir si está en la lista blanca
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true, // Permite enviar cookies
    allowedHeaders: ['Content-Type', 'Authorization','x-access-token','x-access-notification'], 
};

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOptions)); // Aplica las opciones de CORS
app.options('*', cors(corsOptions)); // Preflight requests (opciones)

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

app.get('/', (req, res) => {
    res.json({ msg: "Bienvenido a la API de tu proyecto" });
});

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta incorrecta' });
});

export default app;
