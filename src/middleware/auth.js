export const isAuthenticated = (req, res, next) => {
    try {
        // Verificar si el usuario está autenticado mediante la sesión
        if (req.session && req.session.userId) {
            return next(); // Si está autenticado, permite continuar
        } else {
            // Si no está autenticado, devolver un error 401 (No autorizado)
            return res.status(401).json({ message: 'No autorizado. Por favor, inicia sesión.' });
        }
    } catch (error) {
        console.error("Error en el middleware de autenticación:", error);
        return res.status(500).json({ message: 'Error en el servidor al verificar autenticación.' });
    }
};