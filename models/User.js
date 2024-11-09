const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    numero_documento: {type: String, required: true, unique: true},
    tipo_documento: {type: String, enum: ['Id', 'Licencia', 'Pasaporte', 'Numero Social', 'ITIN', 'Cedula', 'Otro'], default: 'Otro', required: true},
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    nombre: {type: String, required: true},
    numero_movil: {type: String},
    direccion: {type: String},
    tiempo_de_residencia: {type: String},
    pais_de_origen: {type: String},
    estado_civil: { type: String, enum: ['Soltero/a', 'Casado/a', 'Viudo/a', 'Divorciado/a', 'Union Libre'], default: 'Soltero/a' },
    persona_a_cargo: {type: String},
    prestamos_activos: {type: String},
    trabajo_actual: {type: String},
    ganancias_mensuales: {type: String},
    gastos_mensuales: {type: String},
    motivo_de_la_solicitud_de_prestamo: {type: String},
    monto_a_solicitar: {type: String},
    valor_cuota: {type: String},
    saldo: {type: String, required: true},
    tipo_de_cuenta: {type: String, required: true},
    numero_de_cuenta: {type: String, required: true},
    estado_de_cuenta: {type: String, required: true},

}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);
