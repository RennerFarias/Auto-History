// Middleware de autorização por perfil (role).
// Uso: authorize('admin') libera a rota apenas para usuários com role 'admin'.
// Deve ser usado sempre DEPOIS do middleware `protect`.
function authorize(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autorizado.' });
    }

    if (!rolesPermitidos.includes(req.usuario.role)) {
      return res.status(403).json({
        erro: `Acesso negado. Esta ação é restrita ao(s) perfil(is): ${rolesPermitidos.join(', ')}.`,
      });
    }

    next();
  };
}

module.exports = { authorize };
