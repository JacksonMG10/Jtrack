const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db'); 

// === IMPORTAR RUTAS ===
const usuarioRoutes = require('./routes/usuarioRoutes');
const vehiculoRoutes = require('./routes/vehiculoRoutes');
const mantenimientoRoutes = require('./routes/mantenimientoRoutes');
const recordatorioRoutes = require('./routes/recordatorioRoutes');
const publicacionRoutes = require('./routes/publicacionRoutes');
const tutorialRoutes = require('./routes/tutorialRoutes');

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());

// === USAR RUTAS ===
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/recordatorios', recordatorioRoutes);
app.use('/api/publicaciones', publicacionRoutes);
app.use('/api/tutoriales', tutorialRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API REST de JTRACK!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de JTRACK corriendo en http://localhost:${PORT}`);
});

