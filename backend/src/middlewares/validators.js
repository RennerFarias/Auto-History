const { body, validationResult } = require('express-validator');

// Middleware que verifica o resultado das validações acima e
// retorna 400 com a lista de erros, caso existam.
function validar(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erro: erros.array()[0].msg, detalhes: erros.array() });
  }
  next();
}

const validarRegistro = [
  body('nome').trim().notEmpty().withMessage('O nome é obrigatório.'),
  body('email').trim().isEmail().withMessage('Informe um email válido.'),
  body('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres.'),
  validar,
];

const validarLogin = [
  body('email').trim().isEmail().withMessage('Informe um email válido.'),
  body('senha').notEmpty().withMessage('A senha é obrigatória.'),
  validar,
];

const validarVeiculo = [
  body('placa').trim().notEmpty().withMessage('A placa é obrigatória.'),
  body('modelo').trim().notEmpty().withMessage('O modelo é obrigatório.'),
  body('marca').trim().notEmpty().withMessage('A marca é obrigatória.'),
  body('ano')
    .optional({ checkFalsy: true })
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Informe um ano válido.'),
  body('km')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('A quilometragem não pode ser negativa.'),
  validar,
];

const validarManutencao = [
  body('tipo').trim().notEmpty().withMessage('O tipo de manutenção é obrigatório.'),
  body('data').notEmpty().withMessage('A data é obrigatória.').isISO8601().withMessage('Data inválida.'),
  body('quilometragem')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('A quilometragem não pode ser negativa.'),
  body('custo')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('O custo não pode ser negativo.'),
  validar,
];

const validarOficina = [
  body('nome').trim().notEmpty().withMessage('O nome da oficina é obrigatório.'),
  validar,
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarVeiculo,
  validarManutencao,
  validarOficina,
};
