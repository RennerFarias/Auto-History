import apiFetch from './api';

export function listarOficinas() {
  return apiFetch('/oficinas');
}
