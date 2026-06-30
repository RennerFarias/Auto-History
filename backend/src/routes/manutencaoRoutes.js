const express = require('express');
const { atualizarManutencao, excluirManutencao } = require('../controllers/manutencaoController');
const { protect } = require('../middlewares/auth');
const { validarManutencao } = require('../middlewares/validators');

const router = express.Router();

router.use(protect);

// PUT    /api/manutencoes/:id
// DELETE /api/manutencoes/:id
router.route('/:id')
  .put(validarManutencao, atualizarManutencao)
  .delete(excluirManutencao);

module.exports = router;
