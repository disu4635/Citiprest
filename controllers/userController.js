const User = require('../models/User'); 
const bcrypt = require('bcrypt');

exports.getUserDashboard = async (req, res) => {
    try {
        // Buscar el usuario en la base de datos usando su ID del token
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).render('error', { errorMessage: 'Usuario no encontrado' });
        }

        // Enviar los datos del usuario a la vista
        res.render('userDashboard', {
            saldo: user.saldo,
            nombre: user.nombre,
            estado_de_cuenta: user.estado_de_cuenta,
            tipo_de_cuenta: user.tipo_de_cuenta,
            numero_de_cuenta: user.numero_de_cuenta
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error', { errorMessage: 'Error interno del servidor' });
    }
};

exports.getUpdateUserPage = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).render('error', { errorMessage: 'Usuario no encontrado' });
        }

        res.render('updateUser', { user });
    } catch (error) {
        console.error('Error al cargar la página de actualización de usuario:', error);
        return res.status(500).render('error', { errorMessage: 'Error interno del servidor' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.body.userId;
        
        // Recoge los datos de actualización
        const updatedData = {
            numero_documento: req.body.numero_documento,
            tipo_documento: req.body.tipo_documento,
            email: req.body.email,
            role: req.body.role,
            nombre: req.body.nombre,
            numero_movil: req.body.numero_movil,
            direccion: req.body.direccion,
            tiempo_de_residencia: req.body.tiempo_de_residencia,
            pais_de_origen: req.body.pais_de_origen,
            estado_civil: req.body.estado_civil,
            persona_a_cargo: req.body.persona_a_cargo,
            prestamos_activos: req.body.prestamos_activos,
            trabajo_actual: req.body.trabajo_actual,
            ganancias_mensuales: req.body.ganancias_mensuales,
            gastos_mensuales: req.body.gastos_mensuales,
            motivo_de_la_solicitud_de_prestamo: req.body.motivo_de_la_solicitud_de_prestamo,
            monto_a_solicitar: req.body.monto_a_solicitar,
            valor_cuota: req.body.valor_cuota,
            saldo: req.body.saldo,
            tipo_de_cuenta: req.body.tipo_de_cuenta,
            numero_de_cuenta: req.body.numero_de_cuenta,
            estado_de_cuenta: req.body.estado_de_cuenta
        };

        // Si el usuario ha proporcionado una nueva contraseña, encripta y actualiza
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(req.body.password, salt);
        }

        // Actualiza el usuario
        await User.findByIdAndUpdate(userId, updatedData);
        res.redirect('/admin/dashboard'); // Redirige a la página de administración
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.status(500).render('error', { errorMessage: 'Error interno del servidor' });
    }
};

