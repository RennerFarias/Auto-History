const Veiculo = require('../models/Veiculo');
const Manutencao = require('../models/Manutencao');
const { asyncHandler } = require('../middlewares/errorHandler');

// Busca um veículo garantindo que ele pertence ao usuário logado.
// Retorna null se não existir ou não pertencer a ele (e responde 404 nesse caso).
async function buscarVeiculoDoUsuario(req, res) {
  const veiculo = await Veiculo.findById(req.params.id);

  if (!veiculo) {
    res.status(404).json({ erro: 'Veículo não encontrado.' });
    return null;
  }

  // Autorização: só o dono do veículo (ou um admin) pode acessá-lo
  const ehDono = veiculo.usuario.toString() === req.usuario._id.toString();
  const ehAdmin = req.usuario.role === 'admin';

  if (!ehDono && !ehAdmin) {
    res.status(403).json({ erro: 'Você não tem permissão para acessar este veículo.' });
    return null;
  }

  return veiculo;
}

// GET /api/veiculos -> lista apenas os veículos do usuário logado
const listarVeiculos = asyncHandler(async (req, res) => {
  const veiculos = await Veiculo.find({ usuario: req.usuario._id }).sort({ createdAt: -1 });
  res.json(veiculos);
});

// GET /api/veiculos/:id
const obterVeiculo = asyncHandler(async (req, res) => {
  const veiculo = await buscarVeiculoDoUsuario(req, res);
  if (!veiculo) return;
  res.json(veiculo);
});

// POST /api/veiculos
const criarVeiculo = asyncHandler(async (req, res) => {
  const { placa, modelo, marca, cor, ano, chassi, km, renavam } = req.body;

  const veiculo = await Veiculo.create({
    placa,
    modelo,
    marca,
    cor,
    ano,
    chassi,
    km,
    renavam,
    usuario: req.usuario._id,
  });

  res.status(201).json(veiculo);
});

// PUT /api/veiculos/:id
const atualizarVeiculo = asyncHandler(async (req, res) => {
  const veiculo = await buscarVeiculoDoUsuario(req, res);
  if (!veiculo) return;

  const camposPermitidos = ['placa', 'modelo', 'marca', 'cor', 'ano', 'chassi', 'km', 'renavam'];
  camposPermitidos.forEach((campo) => {
    if (req.body[campo] !== undefined) veiculo[campo] = req.body[campo];
  });

  await veiculo.save();
  res.json(veiculo);
});

// DELETE /api/veiculos/:id  (remove o veículo e seu histórico de manutenções em cascata)
const excluirVeiculo = asyncHandler(async (req, res) => {
  const veiculo = await buscarVeiculoDoUsuario(req, res);
  if (!veiculo) return;

  await Manutencao.deleteMany({ veiculo: veiculo._id });
  await veiculo.deleteOne();

  res.json({ mensagem: 'Veículo e seu histórico de manutenções foram removidos.' });
});

module.exports = {
  listarVeiculos,
  obterVeiculo,
  criarVeiculo,
  atualizarVeiculo,
  excluirVeiculo,
  buscarVeiculoDoUsuario,
};
