const express = require('express');
const cors = require('cors');
const path = require('path');
const iaRoutes = require('./routes/iaRoutes');
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

// === MIDDLEWARES ===
app.use(cors()); 
app.use(express.json());

/** * CONFIGURACIÓN DE CARPETA PÚBLICA 
 * Esto permite que React pueda acceder a las fotos guardadas en 'uploads'
 * usando la URL http://localhost:3000/uploads/nombre_de_la_foto.jpg
 */
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// === USAR RUTAS ===
app.use('/api/ia', iaRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/mantenimientos', mantenimientoRoutes);
app.use('/api/recordatorios', recordatorioRoutes);
app.use('/api/publicaciones', publicacionRoutes); // Ruta para el muro y comentarios
app.use('/api/tutoriales', tutorialRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API REST de JTRACK!');
});

// Configuración del Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Servidor de JTRACK corriendo en puerto ${PORT}`);
    console.log(`📂 Carpeta de subidas lista en: /uploads`);
    console.log(`=================================================`);
});