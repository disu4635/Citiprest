const jwt = require('jsonwebtoken');

// Verifica si el usuario está autenticado y es un administrador
exports.verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(403).render('error', { errorMessage: 'Acceso denegado. Por favor, inicia sesión.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).render('error', { errorMessage: 'Acceso denegado. No eres administrador.' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).send('Token inválido o expirado.');
    }
};

// Verifica si el usuario está autenticado (para usuarios regulares)
exports.verifyUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).render('error', { errorMessage: 'Acceso denegado. Por favor, inicia sesión.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).render('error', { errorMessage: 'Error interno del servidor' });
    }
};
