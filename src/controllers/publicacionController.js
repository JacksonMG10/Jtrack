const db = require('../config/db');

// 1. Crear una publicación (post) con imagen opcional
exports.crearPublicacion = async (req, res) => {
    try {
        // Recibimos los datos del nuevo esquema
        const { contenido, etiqueta, vehiculo_referencia } = req.body;
        const usuario_id = req.usuario.id_usuario; // Obtenido del Token JWT

        // Si el middleware de Multer detectó una imagen, armamos la URL
        const imagen_url = req.file ? `http://localhost:3000/uploads/${req.file.filename}` : null;

        const [resultado] = await db.query(
            'INSERT INTO publicacion (usuario_id, contenido, etiqueta, vehiculo_referencia, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [usuario_id, contenido, etiqueta || 'General', vehiculo_referencia || null, imagen_url]
        );

        res.status(201).json({
            mensaje: '¡Publicación compartida con éxito!',
            id_publicacion: resultado.insertId,
            imagen_url: imagen_url
        });

    } catch (error) {
        console.error('Error en Publicación:', error.message);
        res.status(500).json({ mensaje: 'Error al crear la publicación' });
    }
};

// 2. Ver todas las publicaciones (Muro Social) con cantidad de likes
exports.obtenerMuro = async (req, res) => {
    try {
        const [publicaciones] = await db.query(
            `SELECT 
                p.id, p.contenido, p.etiqueta, p.vehiculo_referencia, p.imagen_url, p.fecha_creacion,
                u.nombre, u.apellido,
                (SELECT COUNT(*) FROM reaccion r WHERE r.publicacion_id = p.id) AS total_likes
            FROM publicacion p 
            JOIN usuario u ON p.usuario_id = u.id_usuario 
            ORDER BY p.fecha_creacion DESC`
        );
        res.json(publicaciones);
    } catch (error) {
        console.error('Error al obtener muro:', error.message);
        res.status(500).json({ mensaje: 'Error al obtener el muro social' });
    }
};

// 3. Dar o Quitar Like (¡NUEVA FUNCIÓN!)
exports.darLike = async (req, res) => {
    try {
        const { id_publicacion } = req.body;
        const usuario_id = req.usuario.id_usuario;

        // Intentamos insertar el Like
        await db.query(
            'INSERT INTO reaccion (usuario_id, publicacion_id, tipo) VALUES (?, ?, "like")',
            [usuario_id, id_publicacion]
        );

        res.status(201).json({ mensaje: '¡Like agregado!' });

    } catch (error) {
        // Si el error es por duplicado (código 1062 en MySQL), significa que ya le había dado like.
        // Entonces procedemos a QUITARLO (Dislike).
        if (error.code === 'ER_DUP_ENTRY') {
            try {
                await db.query(
                    'DELETE FROM reaccion WHERE usuario_id = ? AND publicacion_id = ?',
                    [usuario_id, req.body.id_publicacion]
                );
                return res.json({ mensaje: 'Like eliminado (Dislike)' });
            } catch (errDelete) {
                return res.status(500).json({ mensaje: 'Error al quitar el like' });
            }
        }
        console.error('Error en Like:', error.message);
        res.status(500).json({ mensaje: 'Error al procesar la reacción' });
    }
};

// 4. Agregar un comentario a una publicación
exports.comentarPublicacion = async (req, res) => {
    try {
        const { id_publicacion, texto } = req.body;
        const usuario_id = req.usuario.id_usuario;

        const [resultado] = await db.query(
            'INSERT INTO comentario (publicacion_id, usuario_id, texto) VALUES (?, ?, ?)',
            [id_publicacion, usuario_id, texto]
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

// 5. Eliminar una publicación (Solo si le pertenece al usuario)
exports.eliminarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params; 
        const usuario_id = req.usuario.id_usuario; 

        const [resultado] = await db.query(
            'DELETE FROM publicacion WHERE id = ? AND usuario_id = ?',
            [id_publicacion, usuario_id]
        );

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

// 6. Editar el texto de una publicación
exports.editarPublicacion = async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const { contenido } = req.body;
        const usuario_id = req.usuario.id_usuario;

        const [resultado] = await db.query(
            'UPDATE publicacion SET contenido = ? WHERE id = ? AND usuario_id = ?',
            [contenido, id_publicacion, usuario_id]
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