import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import session from 'express-session'; // Importar express-session
import MongoStore from 'connect-mongo'; // Importar connect-mongo
import mongoose from './database.js'; // Importar la conexión a la base de datos

// Importación de las rutas desde src/routes
import user from './routes/User.routes.js'; 
import prueba from './routes/prueba.js';

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',  // Especifica el origen permitido
    credentials: true,                 // Permite el envío de cookies o credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
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

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta incorrecta' });
});

export default app;
