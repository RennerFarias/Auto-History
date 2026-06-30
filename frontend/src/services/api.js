// Camada base de comunicação com a API do backend.
// Centraliza a URL base, o envio automático do token JWT e o tratamento de erros.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiFetch(endpoint, { method = 'GET', body, autenticado = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (autenticado) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Tenta ler o corpo como JSON; algumas respostas (204) podem vir vazias
  let dados = null;
  const texto = await resposta.text();
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = null;
    }
  }

  if (!resposta.ok) {
    const mensagem = dados?.erro || `Erro ${resposta.status} ao comunicar com o servidor.`;
    throw new Error(mensagem);
  }

  return dados;
}

export default apiFetch;
