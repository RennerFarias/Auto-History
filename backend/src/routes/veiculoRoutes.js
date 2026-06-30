const express = require('express');
const {
  listarVeiculos,
  obterVeiculo,
  criarVeiculo,
  atualizarVeiculo,
  excluirVeiculo,
} = require('../controllers/veiculoController');
const { listarManutencoes, criarManutencao } = require('../controllers/manutencaoController');
const { protect } = require('../middlewares/auth');
const { validarVeiculo, validarManutencao } = require('../middlewares/validators');

const router = express.Router();

// Todas as rotas de veículos exigem usuário autenticado
router.use(protect);

router.route('/')
  .get(listarVeiculos)
  .post(validarVeiculo, criarVeiculo);

router.route('/:id')
  .get(obterVeiculo)
  .put(validarVeiculo, atualizarVeiculo)
  .delete(excluirVeiculo);

// Sub-recurso: histórico de manutenções de um veículo específico
// GET    /api/veiculos/:veiculoId/manutencoes
// POST   /api/veiculos/:veiculoId/manutencoes
router.route('/:veiculoId/manutencoes')
  .get(listarManutencoes)
  .post(validarManutencao, criarManutencao);

module.exports = router;
