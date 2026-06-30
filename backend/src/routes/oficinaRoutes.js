const express = require('express');
const {
  listarOficinas,
  obterOficina,
  criarOficina,
  atualizarOficina,
  excluirOficina,
} = require('../controllers/oficinaController');
const { protect } = require('../middlewares/auth');
const { authorize } = require('../middlewares/authorize');
const { validarOficina } = require('../middlewares/validators');

const router = express.Router();

// Leitura é pública (qualquer visitante pode ver as oficinas parceiras)
router.get('/', listarOficinas);
router.get('/:id', obterOficina);

// Escrita exige login + perfil admin
router.post('/', protect, authorize('admin'), validarOficina, criarOficina);
router.put('/:id', protect, authorize('admin'), validarOficina, atualizarOficina);
router.delete('/:id', protect, authorize('admin'), excluirOficina);

module.exports = router;
