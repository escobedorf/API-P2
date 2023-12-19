// Importaciones necesarias
const usuarios = require('../models/auth.model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET || "PasswordRicky";

// Función de login
exports.login = async (req, res) => {
    try {
        const { correo, clave } = req.body;
        if (!correo || !clave) {
            return res.status(400).json({
                estado: 0,
                mensaje: "Faltan parámetros"
            });
        }

        const usuario = await usuarios.findOne({ correo: correo });
        if (!usuario) {
            return res.status(404).json({
                estado: 0,
                mensaje: "Usuario no encontrado"
            });
        }

        const resultadoComparacion = await bcrypt.compare(clave, usuario.clave);
        if (resultadoComparacion) {
            const token = jwt.sign({ correo: usuario.correo }, secretKey);
            return res.status(200).json({
                estado: 1,
                mensaje: "Acceso correcto",
                token: token
            });
        } else {
            return res.status(401).json({
                estado: 0,
                mensaje: "Clave incorrecta. Intente de nuevo por favor"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            estado: 0,
            mensaje: "Ocurrió un error desconocido"
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        // Extracción de página, límite y cálculo de salto (skip)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Consulta para obtener el total de usuarios y la lista paginada
        const total = await usuarios.countDocuments();
        const usuariosObtenidos = await usuarios.find().skip(skip).limit(limit);

        // Verificación de existencia de usuarios
        if (!usuariosObtenidos) {
            return res.status(404).json({
                estado: 0,
                mensaje: "Usuarios no encontrados",
            });
        }

        // Cálculo del total de páginas basado en el límite de resultados
        const totalDePaginas = Math.ceil(total / limit);

        // Respuesta con los usuarios obtenidos y detalles de paginación
        return res.status(200).json({
            estado: 1,
            mensaje: "Usuarios obtenidos correctamente",
            data: usuariosObtenidos,
            totalDePaginas: totalDePaginas,
            currentPage: page,
        });
    } catch (error) {
        // Manejo de errores y respuesta en caso de error desconocido
        console.log(error);
        return res.status(500).json({
            estado: 0,
            mensaje: "Ocurrió un error desconocido",
        });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { correo, clave, nombre, apellidos } = req.body;

        // Verificar si el correo o la contraseña están ausentes
        if (!correo || !clave) {
            return res.status(400).json({
                estado: 0,
                mensaje: "Correo y contraseña son obligatorios"
            });
        }

        // Verificar si el usuario ya existe en la base de datos
        const usuarioExistente = await usuarios.findOne({ correo });
        if (usuarioExistente) {
            return res.status(409).json({
                estado: 0,
                mensaje: "El usuario ya existe"
            });
        }

        // Encriptar la contraseña antes de almacenarla en la base de datos
        const hashedClave = await bcrypt.hash(clave, 10); // El segundo argumento es el número de rondas de hashing

        // Crear un nuevo usuario
        const nuevoUsuario = new usuarios({
            correo: correo,
            clave: hashedClave,
            nombre: nombre,
            apellidos: apellidos
            // Otros campos del usuario
        });

        // Guardar el nuevo usuario en la base de datos
        await nuevoUsuario.save();

        return res.status(201).json({
            estado: 1,
            mensaje: "Usuario creado correctamente"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            estado: 0,
            mensaje: "Ocurrió un error desconocido al crear el usuario"
        });
    }
};
