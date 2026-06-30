const Oficina = require('../models/Oficina');
const { asyncHandler } = require('../middlewares/errorHandler');

// GET /api/oficinas -> qualquer usuário autenticado pode listar
const listarOficinas = asyncHandler(async (req, res) => {
  const oficinas = await Oficina.find().sort({ nome: 1 });
  res.json(oficinas);
});

// GET /api/oficinas/:id
const obterOficina = asyncHandler(async (req, res) => {
  const oficina = await Oficina.findById(req.params.id);
  if (!oficina) {
    return res.status(404).json({ erro: 'Oficina não encontrada.' });
  }
  res.json(oficina);
});

// POST /api/oficinas -> restrito a administradores (ver middleware authorize)
const criarOficina = asyncHandler(async (req, res) => {
  const { nome, descricao, localizacao, contato, horario, servicos } = req.body;
  const oficina = await Oficina.create({ nome, descricao, localizacao, contato, horario, servicos });
  res.status(201).json(oficina);
});

// PUT /api/oficinas/:id -> restrito a administradores
const atualizarOficina = asyncHandler(async (req, res) => {
  const oficina = await Oficina.findById(req.params.id);
  if (!oficina) {
    return res.status(404).json({ erro: 'Oficina não encontrada.' });
  }

  const camposPermitidos = ['nome', 'descricao', 'localizacao', 'contato', 'horario', 'servicos'];
  camposPermitidos.forEach((campo) => {
    if (req.body[campo] !== undefined) oficina[campo] = req.body[campo];
  });

  await oficina.save();
  res.json(oficina);
});

// DELETE /api/oficinas/:id -> restrito a administradores
const excluirOficina = asyncHandler(async (req, res) => {
  const oficina = await Oficina.findById(req.params.id);
  if (!oficina) {
    return res.status(404).json({ erro: 'Oficina não encontrada.' });
  }

  await oficina.deleteOne();
  res.json({ mensagem: 'Oficina removida com sucesso.' });
});

module.exports = {
  listarOficinas,
  obterOficina,
  criarOficina,
  atualizarOficina,
  excluirOficina,
};
