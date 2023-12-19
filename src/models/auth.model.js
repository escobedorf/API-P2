const mongoose = require('../config/db');
const { Schema } = mongoose;

//Estructura de la colección de usuarios
const usuarioSchema = new Schema({
    nombre: {
        type: String
    },
    apellidos: {
        type: String
    },
    usuario: {
        type: String,
        unique: true
    },
    correo: {
        type: String,
        unique: true
    },
    clave: {
        type: String,
    }
});

//Correspondencia de la colección en la base de datos
const usuario = mongoose.model('Usuario', usuarioSchema)
module.exports = usuario;