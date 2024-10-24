import PrivacyPolicy from '../models/Politicas.model.js';  // Asegúrate de importar correctamente el modelo

// Crear una nueva política de privacidad
export const createPrivacyPolicy = async (req, res) => {
    try {
        const { title, content, effectiveDate } = req.body;

        // Crear una nueva política de privacidad
        const newPolicy = new PrivacyPolicy({
            title,
            content,
            effectiveDate
        });

        // Guardar en la base de datos
        await newPolicy.save();

        res.status(201).json({ message: 'Nueva política de privacidad creada exitosamente', policy: newPolicy });
    } catch (error) {
        console.error("Error al crear la política de privacidad:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar la política de privacidad actual (y guardar la versión anterior)
export const updatePrivacyPolicy = async (req, res) => {
    try {
        const { id } = req.params;  // ID de la política actual
        const { title, content, effectiveDate } = req.body;

        // Buscar la política actual
        const currentPolicy = await PrivacyPolicy.findById(id);
        if (!currentPolicy) {
            return res.status(404).json({ message: 'Política de privacidad no encontrada' });
        }

        // Mover la política actual a la lista de versiones anteriores
        currentPolicy.previousVersions.push({
            title: currentPolicy.title,
            content: currentPolicy.content,
            createdAt: currentPolicy.createdAt,
            effectiveDate: currentPolicy.effectiveDate
        });

        // Actualizar la política actual con los nuevos datos
        currentPolicy.title = title;
        currentPolicy.content = content;
        currentPolicy.effectiveDate = effectiveDate;
        currentPolicy.createdAt = Date.now();  // Actualizar la fecha de creación

        // Guardar los cambios en la base de datos
        await currentPolicy.save();

        res.status(200).json({ message: 'Política de privacidad actualizada exitosamente', policy: currentPolicy });
    } catch (error) {
        console.error("Error al actualizar la política de privacidad:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener la política de privacidad actual
export const getCurrentPrivacyPolicy = async (req, res) => {
    try {
        // Obtener la política de privacidad más reciente (ordenada por fecha de creación descendente)
        const currentPolicy = await PrivacyPolicy.findOne().sort({ createdAt: -1 });

        if (!currentPolicy) {
            return res.status(404).json({ message: 'No se encontró una política de privacidad actual' });
        }

        res.status(200).json(currentPolicy);
    } catch (error) {
        console.error("Error al obtener la política de privacidad actual:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Listar todas las versiones anteriores de la política de privacidad
export const getPreviousVersions = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la política de privacidad por su ID
        const policy = await PrivacyPolicy.findById(id);
        if (!policy) {
            return res.status(404).json({ message: 'Política de privacidad no encontrada' });
        }

        // Devolver las versiones anteriores
        res.status(200).json(policy.previousVersions);
    } catch (error) {
        console.error("Error al obtener las versiones anteriores de la política de privacidad:", error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
