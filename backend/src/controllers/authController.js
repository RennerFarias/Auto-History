const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middlewares/errorHandler');

function gerarToken(usuarioId) {
  return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function formatarUsuario(usuario) {
  return {
    id: usuario._id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
  };
}

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { nome, email, senha } = req.body;

  const usuarioExistente = await User.findOne({ email: email.toLowerCase().trim() });
  if (usuarioExistente) {
    return res.status(409).json({ erro: 'Já existe um usuário cadastrado com este email.' });
  }

  const usuario = await User.create({ nome, email, senha });
  const token = gerarToken(usuario._id);

  res.status(201).json({ usuario: formatarUsuario(usuario), token });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await User.findOne({ email: email.toLowerCase().trim() }).select('+senha');
  if (!usuario) {
    return res.status(401).json({ erro: 'Email ou senha incorretos.' });
  }

  const senhaCorreta = await usuario.compararSenha(senha);
  if (!senhaCorreta) {
    return res.status(401).json({ erro: 'Email ou senha incorretos.' });
  }

  const token = gerarToken(usuario._id);

  res.json({ usuario: formatarUsuario(usuario), token });
});

// GET /api/auth/me  (rota protegida, usada pelo frontend para restaurar a sessão)
const me = asyncHandler(async (req, res) => {
  res.json({ usuario: formatarUsuario(req.usuario) });
});

module.exports = { register, login, me };
