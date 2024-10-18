import User from "../models/User.Model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';  // Importamos JWT para generar el token
import { transporter } from '../libs/emailConfig.js';  // Importamos Nodemailer

const SECRET = 'super-secret-key';  // Clave secreta (puedes moverla a variables de entorno)

// Configuración para el límite de intentos
const MAX_FAILED_ATTEMPTS = 5;  // Máximo de intentos antes de bloquear
const LOGIN_TIMEOUT = 1 * 60 * 1000;  // 1 minuto de bloqueo (en milisegundos)

// Objeto en memoria para guardar intentos fallidos y bloqueos
let failedLoginAttempts = {};  // Contador de intentos fallidos por email
let loginTimeouts = {};  // Tiempos de bloqueo por email


// Función para registrar un nuevo usuario con verificación por correo
export const signUp = async (req, res) => {
    try {
        const { 
            name, 
            lastname, 
            email, 
            telefono, 
            fechadenacimiento, 
            user, 
            preguntaSecreta, 
            respuestaSecreta, 
            password
        } = req.body;

        // Validar datos esenciales
        if (!name || !lastname || name.length < 3 || lastname.length < 3) {
            return res.status(400).json({ message: "Datos incompletos o inválidos" });
        }

        // Verificar si el usuario o correo ya existe
        const existingUser = await User.findOne({ $or: [{ email }, { user }] });
        if (existingUser) {
            return res.status(400).json({ message: "El usuario o correo ya existe" });
        }

        // *Encriptar la contraseña*
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Crear el nuevo usuario (sin guardar aún)
        const newUser = new User({
            name,
            lastname,
            email,
            telefono,
            fechadenacimiento,
            user,
            preguntaSecreta,
            respuestaSecreta,
            password: hashedPassword,
            verified: false  // Usuario no verificado inicialmente
        });

        // Generar token de verificación (expira en 1 hora)
        const token = jwt.sign({ email: newUser.email }, SECRET, { expiresIn: '1h' });

        // Enviar correo de verificación
        const verificationUrl = `http://localhost:5173/verify/${token}`;
        await transporter.sendMail({
            from: '"Soporte 👻" <jose1fat@gmail.com>',
            to: newUser.email,
            subject: "Verifica tu cuenta ✔️",
            html: `<p>Hola ${newUser.name},</p>
                   <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para verificar tu cuenta:</p>
                   <a href="${verificationUrl}">Verificar Cuenta</a>
                   <p>Este enlace expirará en 1 hora.</p>`,
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        res.status(200).json({ message: "Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta." });

    } catch (error) {
        console.error("Error en la función signUp:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Función para verificar la cuenta del usuario
export const verifyAccount = async (req, res) => {
    try {
        const { token } = req.params;  // Extrae el token desde la URL

        // Verifica y decodifica el token
        const decoded = jwt.verify(token, SECRET);
        const userEmail = decoded.email;  // El email está en el payload del token

        // Busca al usuario por su email
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Verifica si el usuario ya está verificado
        if (user.verified) {
            return res.status(400).json({ message: 'La cuenta ya está verificada.' });
        }

        // Marcar al usuario como verificado
        user.verified = true;
        await user.save();

        res.status(200).json({ message: 'Cuenta verificada exitosamente.' });
    } catch (error) {
        console.error('Error al verificar la cuenta:', error);
        return res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el email y la contraseña están presentes
        if (!email || !password) {
            return res.status(400).json({ message: "Correo y contraseña son requeridos" });
        }

        // Verificar si el usuario está bloqueado por demasiados intentos fallidos
        if (loginTimeouts[email] && Date.now() < loginTimeouts[email]) {
            const remainingTime = Math.ceil((loginTimeouts[email] - Date.now()) / 1000);  // Segundos restantes
            return res.status(429).json({
                message: `Has alcanzado el límite de intentos fallidos. Intenta de nuevo en ${remainingTime} segundos.`,
                remainingTime  // Enviar el tiempo restante en la respuesta
            });
        }

        // Buscar al usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Usuario no encontrado" });
        }

        // Comparar la contraseña ingresada con la encriptada en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Incrementar el contador de intentos fallidos
            failedLoginAttempts[email] = (failedLoginAttempts[email] || 0) + 1;

            // Si se alcanzó el límite de intentos fallidos, bloquear por el tiempo definido
            if (failedLoginAttempts[email] >= MAX_FAILED_ATTEMPTS) {
                loginTimeouts[email] = Date.now() + LOGIN_TIMEOUT;  // Bloquear por 1 minuto
                failedLoginAttempts[email] = 0;  // Reiniciar el contador
                const remainingTime = Math.ceil((loginTimeouts[email] - Date.now()) / 1000);  // Segundos restantes
                return res.status(429).json({
                    message: `Has alcanzado el límite de intentos fallidos. Intenta de nuevo en ${remainingTime} segundos.`,
                    remainingTime  // Enviar el tiempo restante en la respuesta
                });
            }

            return res.status(400).json({ message: `Contraseña incorrecta. Intentos fallidos: ${failedLoginAttempts[email]}/${MAX_FAILED_ATTEMPTS}` });
        }

        // Si la contraseña es correcta, restablecer los contadores de intentos fallidos
        failedLoginAttempts[email] = 0;
        loginTimeouts[email] = null;

        // Login exitoso
        res.status(200).json({ message: "Inicio de sesión exitoso" });

    } catch (error) {
        console.error("Error en la función login:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Función para obtener todos los usuarios
export const getAll = async (req, res) => {
    try {
        const allUsers = await User.find().select('-password'); // Excluir el campo de contraseña
        res.status(200).json(allUsers);
    } catch (error) {
        console.error("Error en la función getAll:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
