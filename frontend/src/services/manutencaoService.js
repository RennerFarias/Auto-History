import apiFetch from './api';

export function listarManutencoes(veiculoId) {
  return apiFetch(`/veiculos/${veiculoId}/manutencoes`);
}

export function criarManutencao(veiculoId, dados) {
  return apiFetch(`/veiculos/${veiculoId}/manutencoes`, { method: 'POST', body: dados });
}

export function atualizarManutencao(id, dados) {
  return apiFetch(`/manutencoes/${id}`, { method: 'PUT', body: dados });
}

export function excluirManutencao(id) {
  return apiFetch(`/manutencoes/${id}`, { method: 'DELETE' });
}
