const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Suponiendo que tengas un modelo User

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

exports.getLogin = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
            return res.render('login', { userAuthenticated: true, userRole: decoded.role, error: null, userId: decoded.id });
        }
    }
    // Si no hay token o no es válido
    res.render('login', { userAuthenticated: false, userRole: null, error: null });
};

// Función para login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('login', { error: 'Usuario no encontrado', userAuthenticated: false, userRole: null });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).render('login', { error: 'Contraseña incorrecta', userAuthenticated: false, userRole: null });
        }

        // Crear el token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        // Redirigir según el rol del usuario, incluyendo el ID en la URL
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        } else {
            return res.redirect(`/user/dashboard/${user._id}`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { errorMessage: 'Error interno del servidor' });
    }
};

// Función para logout
exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
};

