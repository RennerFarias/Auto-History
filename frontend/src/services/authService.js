import apiFetch from './api';

export function registrar({ nome, email, senha }) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: { nome, email, senha },
    autenticado: false,
  });
}

export function login({ email, senha }) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: { email, senha },
    autenticado: false,
  });
}

export function buscarUsuarioLogado() {
  return apiFetch('/auth/me');
}
