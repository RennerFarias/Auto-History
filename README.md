# Auto-History

> **Auto-History** é uma aplicação web desenvolvida com React e Vite para registrar, organizar e exibir o histórico de atividades de um projeto de forma clara e prática.

---

## 📌 Visão geral
O sistema permite que usuários cadastrem eventos ou alterações, visualizem um histórico estruturado e exportem relatórios em PDF. A interface é dividida em telas intuitivas para navegação, registro e visualização de histórico.

## 🚀 Funcionalidades principais
- Registro de atividades com data, autor e descrição
- Visualização de histórico em lista organizada
- Navegação entre páginas usando React Router
- Geração de relatório em PDF usando `jspdf` e `jspdf-autotable`
- Layout responsivo e seção de informações do projeto

## 🧩 Tecnologias utilizadas
- React 19
- Vite
- React Router DOM
- jsPDF + jsPDF-Autotable
- JavaScript moderno (ESM)
- CSS customizado

## 🗂️ Estrutura do projeto
- `auto-history/` - código fonte principal da aplicação
  - `src/` - componentes, páginas e estilos
    - `components/` - componentes reutilizáveis como `Menu` e `NavBar`
    - `pages/` - telas do aplicativo (`Dashboard`, `Home`, `Oficinas`, `SobreNos`, `Veiculo`)
    - `styles/` - arquivos CSS específicos de cada página
    - `utils/` - utilitários como `gerarPdf.js`
  - `public/` - arquivos estáticos, manifest e imagens
- `README.md` - documentação do projeto

## 🧠 Páginas desenvolvidas
- **Home** – apresentação geral do sistema e acesso às funcionalidades
- **Dashboard** – visão geral das principais métricas e histórico recente
- **Oficinas** – lista ou catálogo de oficinas relacionadas ao projeto
- **Veículo** – informações e histórico de um veículo específico
- **Sobre Nós** – informações sobre o projeto e os responsáveis

## ▶️ Como rodar o projeto
1. Clone o repositório:
   ```bash
   git clone <URL-do-projeto>
   ```
2. Entre na pasta do projeto:
   ```bash
   cd auto-history/auto-history
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Abra o browser em `http://localhost:5173`

## 📦 Scripts disponíveis
- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera a versão de produção
- `npm run preview` — pré-visualiza a build gerada
- `npm run lint` — executa o ESLint no projeto

## 👥 Integrantes do grupo
- arthur melo
- Elian Barros
- igor Morais
- Rafael Barbosa
- Renner Farias

## ✅ Observações
- A aplicação usa Vite para build rápida e recarga instantânea.
- O projeto já suporta exportação de histórico em PDF.
- Ajustes de conteúdo visual podem ser feitos em `src/styles/` e `src/components/`.
