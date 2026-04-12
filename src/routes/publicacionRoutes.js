const express = require('express');
const router = express.Router();
const publicacionController = require('../controllers/publicacionController');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear post (Protegido)
router.post('/crear', authMiddleware, publicacionController.crearPublicacion);

// Ver muro (Público o Protegido, lo pondremos protegido para que solo usuarios vean el muro)
router.get('/muro', authMiddleware, publicacionController.obtenerMuro);
// Comentar (Protegido)
router.post('/comentar', authMiddleware, publicacionController.comentarPublicacion);

router.delete('/eliminar/:id_publicacion', authMiddleware, publicacionController.eliminarPublicacion);

// Editar post (Protegido)
router.put('/editar/:id_publicacion', authMiddleware, publicacionController.editarPublicacion);

module.exports = router;