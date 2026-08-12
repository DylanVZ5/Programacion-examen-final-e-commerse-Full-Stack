// Inicio de sesión (login)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Busca el usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Compara contraseñas usando el hash guardado
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Generar el token JWT (propiedades sin guion bajo excepto _id)
        const payload = {
            id: user._id,
            nombre: user.nombre,
            email: user.email,
            rol: user.rol
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h'
        });

        // Enviar respuesta con el token y datos del usuario
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