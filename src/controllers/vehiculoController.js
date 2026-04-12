const db = require('../config/db');

exports.registrarVehiculo = async (req, res) => {
    try {
        const { marca, modelo, año, tipo, kilometraje } = req.body;
        
        // ¡Magia! El id_usuario ya no viene del frontend, viene del Token validado por nuestro middleware
        const id_usuario = req.usuario.id_usuario;

        const [resultado] = await db.query(
            'INSERT INTO VEHICULO (id_usuario, marca, modelo, año, tipo, kilometraje) VALUES (?, ?, ?, ?, ?, ?)',
            [id_usuario, marca, modelo, año, tipo, kilometraje]
        );

        res.status(201).json({
            mensaje: '¡Vehículo registrado exitosamente en JTRACK!',
            id_vehiculo: resultado.insertId
        });

    } catch (error) {
        console.error('Error al registrar vehículo:', error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
    }
};
// NUEVA FUNCIÓN: Obtener los vehículos del usuario logueado
exports.obtenerMisVehiculos = async (req, res) => {
    try {
        // Obtenemos el ID de Juan desde su Token VIP
        const id_usuario = req.usuario.id_usuario;

        // Buscamos en la base de datos solo los carros que le pertenecen a él
        const [vehiculos] = await db.query(
            'SELECT * FROM VEHICULO WHERE id_usuario = ?',
            [id_usuario]
        );

        // Devolvemos la lista de vehículos
        res.json(vehiculos);

    } catch (error) {
        console.error('Error al obtener vehículos:', error);
        res.status(500).json({ mensaje: 'Hubo un error en el servidor' });
    }
};