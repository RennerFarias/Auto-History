const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifica se existe um token JWT válido no header Authorization e
// anexa o usuário autenticado em req.usuario
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ erro: 'Não autorizado. Faça login para continuar.' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await User.findById(payload.id);
    if (!usuario) {
      return res.status(401).json({ erro: 'Usuário do token não existe mais.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = { protect };
