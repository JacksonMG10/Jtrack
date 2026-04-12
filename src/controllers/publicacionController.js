const db = require('../config/db');

// 1. Crear una publicación (post)
exports.crearPublicacion = async (req, res) => {
    try {
        const { descripcion, archivo_url, tipo_archivo } = req.body;
        const id_usuario = req.usuario.id_usuario; // Obtenido del Token JWT

        const [resultado] = await db.query(
            'INSERT INTO PUBLICACION (id_usuario, descripcion, archivo_url, tipo_archivo) VALUES (?, ?, ?, ?)',
            [id_usuario, descripcion, archivo_url, tipo_archivo]
        );

        res.status(201).json({
            mensaje: '¡Publicación compartida con éxito!',
            id_publicacion: resultado.insertId
        });

    } catch (error) {
        console.error('Error en Publicación:', error.message);
        res.status(500).json({ mensaje: 'Error al crear la publicación' });
    }
};

// 2. Ver todas las publicaciones (Muro Social)
exports.obtenerMuro = async (req, res) => {
    try {
        // Obtenemos publicaciones unidas con el nombre del usuario que las subió
        const [publicaciones] = await db.query(
            `SELECT p.*, u.nombre, u.apellido 
            FROM PUBLICACION p 
            JOIN USUARIO u ON p.id_usuario = u.id_usuario 
            ORDER BY p.fecha_publicacion DESC`
        );
        res.json(publicaciones);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el muro social' });
    }
};
// 3. Agregar un comentario a una publicación
exports.comentarPublicacion = async (req, res) => {
    try {
        const { id_publicacion, texto } = req.body;
        const id_usuario = req.usuario.id_usuario;

        const [resultado] = await db.query(
            'INSERT INTO COMENTARIO (id_publicacion, id_usuario, texto) VALUES (?, ?, ?)',
            [id_publicacion, id_usuario, texto]
        );

        res.status(201).json({
            mensaje: 'Comentario agregado',
            id_comentario: resultado.insertId
        });
    } catch (error) {
        console.error('Error al comentar:', error.message);
        res.status(500).json({ mensaje: 'Error al procesar el comentario' });
    }
};
// 4. Eliminar una publicación (Solo si le pertenece al usuario)
exports.eliminarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params; // Tomamos el ID de la URL
        const id_usuario = req.usuario.id_usuario; // Tomamos el ID del Token

        // Ejecutamos el DELETE con doble filtro por seguridad
        const [resultado] = await db.query(
            'DELETE FROM PUBLICACION WHERE id_publicacion = ? AND id_usuario = ?',
            [id_publicacion, id_usuario]
        );

        // Si no se borró nada, es porque la publicación no existe o no es de ese usuario
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ 
                mensaje: 'No se encontró la publicación o no tienes permiso para eliminarla' 
            });
        }

        res.json({ mensaje: 'Publicación eliminada correctamente' });

    } catch (error) {
        console.error('Error al eliminar:', error.message);
        res.status(500).json({ mensaje: 'Error al intentar eliminar la publicación' });
    }
};
// 5. Editar el texto de una publicación
exports.editarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const { descripcion } = req.body;
        const id_usuario = req.usuario.id_usuario;

        const [resultado] = await db.query(
            'UPDATE PUBLICACION SET descripcion = ? WHERE id_publicacion = ? AND id_usuario = ?',
            [descripcion, id_publicacion, id_usuario]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'No se pudo editar: la publicación no existe o no eres el dueño' });
        }

        res.json({ mensaje: 'Publicación actualizada correctamente' });

    } catch (error) {
        console.error('Error al editar:', error.message);
        res.status(500).json({ mensaje: 'Error al actualizar la publicación' });
    }
};