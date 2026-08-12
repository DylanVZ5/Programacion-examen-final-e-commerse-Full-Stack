const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro de usuario
exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            nombre,
            email,
            password: hashedPassword,
            rol: rol || 'user'
        });

        await newUser.save();

        return res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: newUser._id,
                nombre: newUser.nombre,
                email: newUser.email,
                rol: newUser.rol
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            message: 'Error en el servidor al registrar usuario.', 
            error: error.message 
        });
    }
};

// Inicio de sesión (login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const payload = {
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });

        return res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            user: payload
        });

    } catch (error) {
        return res.status(500).json({ 
            message: 'Error en el servidor al iniciar sesión.', 
            error: error.message 
        });
    }
};