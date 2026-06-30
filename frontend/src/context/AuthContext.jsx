import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Ao carregar a aplicação, se houver um token salvo, valida com o backend
  // e restaura a sessão (em vez de confiar cegamente no localStorage).
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCarregando(false);
      return;
    }

    authService
      .buscarUsuarioLogado()
      .then(({ usuario }) => setUsuario(usuario))
      .catch(() => {
        localStorage.removeItem('token');
        setUsuario(null);
      })
      .finally(() => setCarregando(false));
  }, []);

  async function entrar({ email, senha }) {
    const { usuario, token } = await authService.login({ email, senha });
    localStorage.setItem('token', token);
    setUsuario(usuario);
  }

  async function cadastrar({ nome, email, senha }) {
    const { usuario, token } = await authService.registrar({ nome, email, senha });
    localStorage.setItem('token', token);
    setUsuario(usuario);
  }

  function sair() {
    localStorage.removeItem('token');
    setUsuario(null);
  }

  const valor = {
    usuario,
    estaLogado: !!usuario,
    carregando,
    entrar,
    cadastrar,
    sair,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>');
  }
  return contexto;
}
