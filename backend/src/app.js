const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/index');
const errorMiddleware = require('./middlewares/error.middleware');


dotenv.config();

const app = express();

// Conectar a MongoDB Atlas
connectDB();

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://programacion-examen-final-e-commerse.onrender.com'
  ],
  credentials: true
}));

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api', apiRoutes);

// Middleware de manejo de errores
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});


module.exports = app;