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

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cors()); // Desactiva CORS para pruebas, permite todas las solicitudes
app.options('*', cors()); // Habilita preflight requests para todos los métodos

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
