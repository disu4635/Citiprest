const User = require('../models/User');
const bcrypt = require('bcrypt');

// Crear un nuevo usuario
exports.createUser = async (req, res) => {
    const {
        numero_documento,
        tipo_documento,
        email,
        password,
        role,
        nombre,
        numero_movil,
        direccion,
        tiempo_de_residencia,
        pais_de_origen,
        estado_civil,
        persona_a_cargo,
        prestamos_activos,
        trabajo_actual,
        ganancias_mensuales,
        gastos_mensuales,
        motivo_de_la_solicitud_de_prestamo,
        monto_a_solicitar,
        valor_cuota,
        saldo,
        tipo_de_cuenta,
        numero_de_cuenta,
        estado_de_cuenta
    } = req.body;

    // Hashear la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Crear un nuevo usuario con todos los campos proporcionados
        const newUser = new User({
            numero_documento,
            tipo_documento,
            email,
            password: hashedPassword,
            role,
            nombre,
            numero_movil,
            direccion,
            tiempo_de_residencia,
            pais_de_origen,
            estado_civil,
            persona_a_cargo,
            prestamos_activos,
            trabajo_actual,
            ganancias_mensuales,
            gastos_mensuales,
            motivo_de_la_solicitud_de_prestamo,
            monto_a_solicitar,
            valor_cuota,
            saldo,
            tipo_de_cuenta,
            numero_de_cuenta,
            estado_de_cuenta
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();
        res.redirect('/admin/dashboard?success=Usuario creado correctamente');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/dashboard?error=Error al crear usuario');
    }
};

// Eliminar un usuario
exports.deleteUser = async (req, res) => {
    const { userId } = req.body;

    try {
        await User.findByIdAndDelete(userId);
        res.redirect('/admin/dashboard?success=Usuario Eliminado');
    } catch (error) {
        res.redirect('/admin/dashboard?error=Error al eliminar el usuario');
    }
};

// Actualizar un usuario
exports.updateUser = async (req, res) => {
    const { userId, email, role } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { email, role });
        res.redirect('/admin/dashboard?success=Usuario Actualizado');
    } catch (error) {
        res.redirect('/admin/dashboard?error=Error al actualizar el usuario');
    }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    const success = req.query.success || null;
    const error = req.query.error || null;

    try {
        const users = await User.find();
        res.render('adminDashboard', { users, success, error });
    } catch (error) {
        res.redirect('/admin/dashboard?error=Error al obtener usuarios');
    }
};
