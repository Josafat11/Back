import { Router } from "express";
import * as userController from "../controllers/User.controller.js";
import { isAuthenticated, isAdmin } from '../middleware/auth.js'; // Importa los middlewares de autenticación y autorización

const router = Router();

// Rutas públicas
router.post('/signup', userController.signUp); // Registro de usuario
router.post('/login', userController.login); // Inicio de sesión
router.get('/verify/:token', userController.verifyAccount); // Verificar cuenta por token
router.post('/send-reset-email', userController.sendPasswordResetLink); // Enviar enlace de restablecimiento de contraseña
router.post('/reset-password/:token', userController.resetPassword); // Restablecer la contraseña

// Rutas protegidas (requieren estar autenticado)
router.get('/check-session', isAuthenticated, userController.checkSession); // Verificar la sesión
router.post('/logout', isAuthenticated, userController.logout); // Cerrar sesión

// Ruta para que el usuario autenticado vea su perfil
router.get('/profile', isAuthenticated, userController.getProfile); // Obtener el perfil del usuario autenticado

// Rutas protegidas para CRUD de usuarios (requiere ser administrador)
router.get('/users', isAuthenticated, isAdmin, userController.getAllUsers); // Obtener todos los usuarios
router.get('/users/:id', isAuthenticated, isAdmin, userController.getUserById); // Obtener un solo usuario por ID
router.put('/users/:id', isAuthenticated, isAdmin, userController.updateUser); // Actualizar un usuario
router.delete('/users/:id', isAuthenticated, isAdmin, userController.deleteUser); // Eliminar un usuario (eliminación lógica)

// Rutas del admin para ver usuarios recientes y bloqueados
router.get('/admin/recent-users', isAuthenticated, isAdmin, userController.getRecentUsers);
router.get('/admin/recent-blocked', isAuthenticated, isAdmin, userController.getRecentBlockedUsers);

export default router;
