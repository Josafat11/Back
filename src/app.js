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

// URI de MongoDB Atlas para producción
const atlasURI = 'mongodb+srv://Josafat:FamiliaHD1@cluster0.dnsqacd.mongodb.net/Refaccionaria?retryWrites=true&w=majority';

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Configuración de CORS para producción
const listWhite = [
    'http://localhost:3000',  // Frontend en desarrollo
    'https://frontend-five-roan-17.vercel.app', // Frontend en producción
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || listWhite.indexOf(origin) !== -1) {
            callback(null, true); // Permitir si está en la lista blanca
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Habilita preflight requests

// Configuración de sesiones utilizando MongoDB Atlas
app.use(session({
    secret: 'mi_secreto_seguro',  // Cambia esto por algo más seguro
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: atlasURI,  // Actualiza la URI de MongoDB Atlas
        mongooseConnection: mongoose.connection
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',  // Asegura las cookies en producción
        maxAge: 1000 * 60 * 60,  // 1 hora
        sameSite: 'strict'  // Asegura que las cookies solo se envíen en el mismo sitio
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
