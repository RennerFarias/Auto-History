// Middleware central de tratamento de erros.
// Qualquer erro passado para next(err) ou lançado dentro de um controller
// async (capturado pelo asyncHandler) cai aqui.
function errorHandler(err, req, res, next) {
  console.error(err);

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const mensagens = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ erro: mensagens.join(' | ') });
  }

  // Erro de chave duplicada (ex: placa ou email já cadastrados)
  if (err.code === 11000) {
    const campo = Object.keys(err.keyPattern || {}).join(', ');
    return res.status(409).json({ erro: `Já existe um registro com esse(s) campo(s): ${campo}` });
  }

  // ObjectId inválido (ex: id mal formatado na URL)
  if (err.name === 'CastError') {
    return res.status(400).json({ erro: 'Identificador inválido.' });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ erro: err.message || 'Erro interno do servidor.' });
}

// Wrapper para evitar try/catch repetido em todo controller async
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = { errorHandler, asyncHandler };
