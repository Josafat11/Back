import { Router } from "express";
import * as userController from "../controllers/User.controller.js";
import { isAuthenticated } from '../middleware/auth.js'; // Importa el middleware

const router = Router();

// Rutas públicas
router.post('/signup', userController.signUp); // Registro de usuario
router.post('/login', userController.login); // Inicio de sesión
router.get('/verify/:token', userController.verifyAccount); // Verificar cuenta por token
router.post('/send-reset-email', userController.sendPasswordResetLink); // Enviar enlace de restablecimiento de contraseña
router.post('/reset-password/:token', userController.resetPassword);

// Rutas protegidas
router.get('/users', isAuthenticated, userController.getAll); // Obtener todos los usuarios (requiere autenticación)
router.post('/logout', isAuthenticated, userController.logout); // Cerrar sesión (requiere autenticación)

// Ruta para verificar la sesión
router.get('/check-session', userController.checkSession);

export default router;
