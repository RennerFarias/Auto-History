const Manutencao = require('../models/Manutencao');
const Veiculo = require('../models/Veiculo');
const { asyncHandler } = require('../middlewares/errorHandler');

// Garante que o veículo referenciado existe e pertence ao usuário logado (ou ele é admin)
async function autorizarAcessoAoVeiculo(req, res, veiculoId) {
  const veiculo = await Veiculo.findById(veiculoId);

  if (!veiculo) {
    res.status(404).json({ erro: 'Veículo não encontrado.' });
    return null;
  }

  const ehDono = veiculo.usuario.toString() === req.usuario._id.toString();
  const ehAdmin = req.usuario.role === 'admin';

  if (!ehDono && !ehAdmin) {
    res.status(403).json({ erro: 'Você não tem permissão para acessar este veículo.' });
    return null;
  }

  return veiculo;
}

// GET /api/veiculos/:veiculoId/manutencoes -> histórico de um veículo específico
const listarManutencoes = asyncHandler(async (req, res) => {
  const veiculo = await autorizarAcessoAoVeiculo(req, res, req.params.veiculoId);
  if (!veiculo) return;

  const manutencoes = await Manutencao.find({ veiculo: veiculo._id }).sort({ data: -1 });
  res.json(manutencoes);
});

// POST /api/veiculos/:veiculoId/manutencoes -> registra nova manutenção
const criarManutencao = asyncHandler(async (req, res) => {
  const veiculo = await autorizarAcessoAoVeiculo(req, res, req.params.veiculoId);
  if (!veiculo) return;

  const { tipo, quilometragem, oficina, data, custo, descricao } = req.body;

  const manutencao = await Manutencao.create({
    tipo,
    quilometragem,
    oficina,
    data,
    custo,
    descricao,
    veiculo: veiculo._id,
  });

  // Atualiza a quilometragem atual do veículo, se a nova for maior
  if (quilometragem && quilometragem > (veiculo.km || 0)) {
    veiculo.km = quilometragem;
    await veiculo.save();
  }

  res.status(201).json(manutencao);
});

// PUT /api/manutencoes/:id
const atualizarManutencao = asyncHandler(async (req, res) => {
  const manutencao = await Manutencao.findById(req.params.id);
  if (!manutencao) {
    return res.status(404).json({ erro: 'Manutenção não encontrada.' });
  }

  const veiculo = await autorizarAcessoAoVeiculo(req, res, manutencao.veiculo);
  if (!veiculo) return;

  const camposPermitidos = ['tipo', 'quilometragem', 'oficina', 'data', 'custo', 'descricao'];
  camposPermitidos.forEach((campo) => {
    if (req.body[campo] !== undefined) manutencao[campo] = req.body[campo];
  });

  await manutencao.save();
  res.json(manutencao);
});

// DELETE /api/manutencoes/:id
const excluirManutencao = asyncHandler(async (req, res) => {
  const manutencao = await Manutencao.findById(req.params.id);
  if (!manutencao) {
    return res.status(404).json({ erro: 'Manutenção não encontrada.' });
  }

  const veiculo = await autorizarAcessoAoVeiculo(req, res, manutencao.veiculo);
  if (!veiculo) return;

  await manutencao.deleteOne();
  res.json({ mensagem: 'Manutenção removida com sucesso.' });
});

module.exports = {
  listarManutencoes,
  criarManutencao,
  atualizarManutencao,
  excluirManutencao,
};
