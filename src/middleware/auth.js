// Middleware para verificar si el usuario está autenticado
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

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req, res, next) => {
    try {
        // Verificar si el rol del usuario en la sesión es 'admin'
        if (req.session && req.session.role === 'admin') {
            return next(); // Si es admin, permite continuar
        } else {
            // Si no es admin, devolver un error 403 (Prohibido)
            return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
        }
    } catch (error) {
        console.error("Error en el middleware de autorización de admin:", error);
        return res.status(500).json({ message: 'Error en el servidor al verificar permisos.' });
    }
};
