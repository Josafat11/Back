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



// Configuración de CORS para producción
const listWhite = [
    'http://localhost:3000',  // Frontend en desarrollo
    'https://frontend-alpha-six-22.vercel.app', // Frontend correcto en producción
];

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como Postman)
        if (!origin) return callback(null, true);
        if (listWhite.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token','x-access-notification'],
};



const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors( corsOptions ));
app.options('*', cors( corsOptions ));


app.use(session({
    secret: 'mi_secreto_seguro',  // Cambia esto por algo más seguro
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        client: mongoose.connection.getClient(), // Usa el cliente ya conectado
        collectionName: 'sessions', 
        ttl: 14 * 24 * 60 * 60, 
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60, 
        sameSite: 'lax',
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
