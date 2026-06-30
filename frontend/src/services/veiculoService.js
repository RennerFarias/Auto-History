import apiFetch from './api';

export function listarVeiculos() {
  return apiFetch('/veiculos');
}

export function obterVeiculo(id) {
  return apiFetch(`/veiculos/${id}`);
}

export function criarVeiculo(dados) {
  return apiFetch('/veiculos', { method: 'POST', body: dados });
}

export function atualizarVeiculo(id, dados) {
  return apiFetch(`/veiculos/${id}`, { method: 'PUT', body: dados });
}

export function excluirVeiculo(id) {
  return apiFetch(`/veiculos/${id}`, { method: 'DELETE' });
}
