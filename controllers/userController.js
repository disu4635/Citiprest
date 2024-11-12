const User = require('../models/User'); 
const bcrypt = require('bcrypt');

function formatCurrency(value) {
    // Verifica si el valor es un número válido
    if (value && !isNaN(value)) {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value);
    }
    // Si el valor no es un número válido, regresa una cadena vacía o un mensaje personalizado
    return ''; // O puedes retornar "N/A" o cualquier otro valor que desees mostrar
}

function generateRandomCardNumber() {
    let cardNumber = '';
    for (let i = 0; i < 16; i++) {
        cardNumber += Math.floor(Math.random() * 10);
    }
    return cardNumber;
}

function generateRandomExpirationDate() {
    const now = new Date();
    const month = Math.floor(Math.random() * 12) + 1;
    const year = now.getFullYear() + Math.floor(Math.random() * 5) + 1; // Entre 1 y 5 años a futuro
    return new Date(year, month);
}

exports.generarTarjeta = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).render('error', { errorMessage: 'Usuario no encontrado' });
        }

        // Generar número de tarjeta y fecha de caducidad aleatoria
        const numeroDeTarjeta = generateRandomCardNumber();
        const fechaCaducidadTarjeta = generateRandomExpirationDate();

        // Actualizar el usuario con los datos de la tarjeta
        user.numero_de_tarjeta = numeroDeTarjeta;
        user.fecha_caducidad_tarjeta = fechaCaducidadTarjeta;

        // Guardar los cambios en la base de datos
        await user.save();

        // Formatear el número de tarjeta para mostrarlo en grupos de 4 dígitos
        const numeroDeTarjetaFormateado = numeroDeTarjeta.replace(/(\d{4})(?=\d)/g, '$1 ');

        // Formatear la fecha de caducidad para mostrar solo mes y últimos 2 dígitos del año
        const mes = String(fechaCaducidadTarjeta.getMonth() + 1).padStart(2, '0');
        const año = String(fechaCaducidadTarjeta.getFullYear()).slice(-2);
        const fechaCaducidadFormateada = `${mes}/${año}`;

        // Enviar los datos generados al frontend
        res.json({
            success: true,
            numeroDeTarjeta: numeroDeTarjetaFormateado,
            fechaCaducidadTarjeta: fechaCaducidadFormateada,
            nombreUsuario: user.nombre,
        });
    } catch (error) {
        console.error('Error al generar tarjeta:', error);
        return res.status(500).render('error', { errorMessage: 'Error interno del servidor al generar la tarjeta' });
    }
};



exports.eliminarTarjeta = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Actualizar los datos de la tarjeta a null en la base de datos
        await User.findByIdAndUpdate(userId, {
            numero_de_tarjeta: null,
            fecha_caducidad_tarjeta: null,
        });

        res.json({ success: true, message: "Tarjeta eliminada exitosamente." });
    } catch (error) {
        console.error("Error al eliminar la tarjeta:", error);
        res.status(500).json({ success: false, message: "Error al eliminar la tarjeta." });
    }
};

exports.getUserDashboard = (req, res) => {
    const userId = req.params.userId;
    const loggedInUser = req.user;

    // Verificar permisos de acceso
    if (loggedInUser.role === 'admin' || loggedInUser.id === userId) {
        User.findById(userId)
            .then(user => {
                if (!user) {
                    return res.status(404).render('error', { errorMessage: 'Usuario no encontrado.' });
                }
                
                // Formatear número de tarjeta si existe
                const numeroDeTarjetaFormateado = user.numero_de_tarjeta 
                    ? user.numero_de_tarjeta.replace(/(\d{4})(?=\d)/g, '$1 ')
                    : null;

                // Formatear fecha de caducidad si existe
                const fechaCaducidadFormateada = user.fecha_caducidad_tarjeta 
                    ? (() => {
                        const mes = String(user.fecha_caducidad_tarjeta.getMonth() + 1).padStart(2, '0');
                        const año = String(user.fecha_caducidad_tarjeta.getFullYear()).slice(-2);
                        return `${mes}/${año}`;
                    })() 
                    : null;

                // Renderizar la vista con los datos del usuario, incluyendo los de la tarjeta si existen
                res.render('userDashboard', { 
                    nombre: user.nombre,
                    saldo: formatCurrency(user.saldo),
                    estado_de_cuenta: user.estado_de_cuenta,
                    tipo_de_cuenta: user.tipo_de_cuenta,
                    numero_de_cuenta: user.numero_de_cuenta,
                    numero_documento: user.numero_documento,
                    numero_de_ruta: user.numero_de_ruta,
                    tipo_documento: user.tipo_documento,
                    numero_movil: user.numero_movil,
                    direccion: user.direccion,
                    tiempo_de_residencia: user.tiempo_de_residencia,
                    pais_de_origen: user.pais_de_origen,
                    estado_civil: user.estado_civil,
                    persona_a_cargo: user.persona_a_cargo,
                    prestamos_activos: user.prestamos_activos,
                    trabajo_actual: user.trabajo_actual,
                    ganancias_mensuales: formatCurrency(user.ganancias_mensuales),
                    gastos_mensuales: formatCurrency(user.gastos_mensuales),
                    motivo_de_la_solicitud_de_prestamo: user.motivo_de_la_solicitud_de_prestamo,
                    monto_a_solicitar: formatCurrency(user.monto_a_solicitar),
                    valor_cuota: formatCurrency(user.valor_cuota),
                    logued_user_rol: loggedInUser.role,
                    _id: userId,
                    // Datos de la tarjeta formateados
                    numero_de_tarjeta: numeroDeTarjetaFormateado,
                    fecha_caducidad_tarjeta: fechaCaducidadFormateada,
                });
            })
            .catch(err => {
                console.error(err);
                res.status(500).render('error', { errorMessage: 'Error interno del servidor.' });
            });
    } else {
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
            estado_de_cuenta: req.body.estado_de_cuenta,
            numero_de_ruta: req.body.numero_de_ruta
        };

        // Si el usuario ha proporcionado una nueva contraseña, encripta y actualiza
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            updatedData.password = await bcrypt.hash(req.body.password, salt);
        }

        // Actualiza el usuario
        await User.findByIdAndUpdate(userId, updatedData);
        res.redirect('/admin/dashboard?success=Usuario Actualizado'); // Redirige a la página de administración
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return res.redirect('/admin/dashboard?error=Error al actualizar el usuario');
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