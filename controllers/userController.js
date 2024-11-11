const User = require('../models/User'); 
const bcrypt = require('bcrypt');

function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
}

exports.getUserDashboard = (req, res) => {
    const userId = req.params.userId; // Obtener el ID del usuario desde la URL
    const loggedInUser = req.user; // Información del usuario logueado desde el token

    // Verificar si el usuario es el dueño de los datos o es admin
    if (loggedInUser.role === 'admin' || loggedInUser.id === userId) {
        // Buscar el usuario por su ID
        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).render('error', { errorMessage: 'Usuario no encontrado.' });
                }
                // Renderizar la vista con los datos del usuario encontrado
                res.render('userDashboard', { 
                    nombre: user.nombre,
                    saldo: formatCurrency(user.saldo),
                    estado_de_cuenta: user.estado_de_cuenta,
                    tipo_de_cuenta: user.tipo_de_cuenta,
                    numero_de_cuenta: user.numero_de_cuenta,
                    numero_documento: user.numero_documento,
                    tipo_documento: user.tipo_documento,
                    numero_movil: user.numero_movil,
                    direccion: user.direccion,
                    tiempo_de_residencia: user.tiempo_de_residencia,
                    pais_de_origen: user.pais_de_origen,
                    estado_civil: user.estado_civil,
                    persona_a_cargo: user.persona_a_cargo,
                    prestamos_activos: user.prestamos_activos,
                    trabajo_actual: user.trabajo_actual,
                    ganancias_mensuales: formatCurrency(user.ganancias_mensuales,),
                    gastos_mensuales: formatCurrency(user.gastos_mensuales),
                    motivo_de_la_solicitud_de_prestamo: user.motivo_de_la_solicitud_de_prestamo,
                    monto_a_solicitar: formatCurrency(user.monto_a_solicitar),
                    valor_cuota: formatCurrency(user.valor_cuota),
                    logued_user_rol: loggedInUser.role,
                    _id: userId,
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).render('error', { errorMessage: 'Error interno del servidor.' });
            });
    } else {
        // Si el usuario no tiene permiso, mostrar error de acceso
        return res.status(403).render('error', { errorMessage: 'Acceso denegado. No tienes permiso para ver esta información.' });
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

exports.updateUserSaldo = async (req, res) => {
    const { userId } = req.params;
    const { newSaldo } = req.body;
    const loggedInUser = req.user;

    try {
        // Verificar si el usuario logueado es admin
        if (loggedInUser.role !== 'admin') {
            return res.status(403).render('error', { errorMessage: 'No tienes permiso para realizar esta acción.' });
        }

        // Actualizar el saldo del usuario en la base de datos
        await User.findByIdAndUpdate(userId, { saldo: newSaldo });
        res.redirect(`/user/dashboard/${userId}`);
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { errorMessage: 'Error al actualizar el saldo.' });
    }
};
