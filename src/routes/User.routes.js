import { Router } from "express";
import * as userController from "../controllers/User.controller.js";

const router = Router();

// Rutas públicas
router.post('/signup', userController.signUp); // Registro de usuario
router.post('/login', userController.login); // Inicio de sesión
router.get('/users', userController.getAll); // Obtener todos los usuarios
router.get('/verify/:token', userController.verifyAccount); // Verificar cuenta por token

export default router;
