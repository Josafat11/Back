import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session'; // Importar express-session
import MongoStore from 'connect-mongo'; // Importar connect-mongo
import mongoose from './database.js'; // Importar la conexión a la base de datos

// Importación de las rutas desde src/routes
import user from './routes/User.routes.js'; 
import prueba from './routes/prueba.js';
import politicas from './routes/Politicas.routes.js';
import terminos from './routes/Terminos.routes.js';
import deslinde from './routes/Deslinde.routes.js';

const app = express();

// Middlewares
const allowedOrigins = ['http://localhost:3000', 'https://back-steel-iota.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Configuración de sesiones
app.use(session({
    secret: 'mi_secreto_seguro', // Cambia esto por un valor más seguro
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/Refaccionaria', // O usa atlasURI para producción
        mongooseConnection: mongoose.connection // Asegurar que MongoStore use la conexión de Mongoose
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
