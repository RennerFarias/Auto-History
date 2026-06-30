# Auto-History

> Sistema web para registro e consulta do histórico de manutenção de veículos, com cadastro de oficinas parceiras. Permite que cada usuário cadastre seus veículos, registre manutenções (tipo, quilometragem, oficina, custo, descrição) e gere um relatório em PDF do histórico completo.

## 👥 Integrantes do grupo

- Arthur Melo
- Elian Barros
- Igor Morais
- Rafael Barbosa
- Renner Farias

## 📌 Descrição da aplicação

O Auto-History resolve um problema comum na compra e venda de veículos usados: a falta de um histórico confiável de manutenções. Com o sistema, o dono de um veículo cria uma conta, cadastra seus carros e vai registrando cada manutenção realizada (revisão, troca de óleo, reparo, etc.), com data, quilometragem, oficina responsável e custo. Esse histórico pode ser consultado a qualquer momento e exportado em PDF. O sistema também mantém um diretório de oficinas parceiras, disponível para consulta de qualquer visitante.

Funcionalidades principais:
- Cadastro e login de usuários (autenticação via JWT)
- CRUD completo de veículos (cada usuário só acessa os seus próprios veículos)
- CRUD completo de manutenções, vinculadas a um veículo
- Listagem de oficinas parceiras (leitura pública, escrita restrita a administradores)
- Geração de relatório em PDF do histórico de um veículo

## 🧩 Tecnologias utilizadas

**Frontend**
- React 19 + Vite
- React Router DOM
- jsPDF + jsPDF-AutoTable (geração de relatórios em PDF)
- CSS customizado

**Backend**
- Node.js + Express
- MongoDB + Mongoose (MongoDB Atlas)
- JSON Web Token (JWT) para autenticação
- bcryptjs para hash de senhas
- express-validator para validação de dados
- cors, dotenv, morgan

## 🗂️ Estrutura do projeto

Monorepo dividido em duas pastas principais:

```
Auto-History/
├── frontend/                  # Aplicação React (Vite)
│   ├── public/
│   └── src/
│       ├── assets/            # CSS, imagens
│       ├── components/        # Menu, NavBar
│       ├── context/
│       │   └── AuthContext.jsx    # Estado global de autenticação
│       ├── pages/              # Home, Dashboard, Veiculo, Oficinas, SobreNos
│       ├── services/            # Funções que consomem a API (fetch)
│       │   ├── api.js              # wrapper base (URL, headers, token)
│       │   ├── authService.js
│       │   ├── veiculoService.js
│       │   ├── manutencaoService.js
│       │   └── oficinaService.js
│       └── utils/
│           └── gerarPdf.js
│
├── backend/                   # API REST (Node.js + Express)
│   └── src/
│       ├── config/
│       │   └── db.js              # Conexão com o MongoDB
│       ├── models/                # Schemas do Mongoose
│       │   ├── User.js
│       │   ├── Veiculo.js
│       │   ├── Manutencao.js
│       │   └── Oficina.js
│       ├── controllers/           # Regras de negócio de cada entidade
│       ├── routes/                # Definição das rotas da API
│       ├── middlewares/
│       │   ├── auth.js             # Verificação do token JWT
│       │   ├── authorize.js        # Controle de acesso por perfil (role)
│       │   ├── validators.js       # Validações de entrada (express-validator)
│       │   └── errorHandler.js
│       ├── scripts/
│       │   └── seed.js             # Cria um usuário admin e popula oficinas
│       └── server.js              # Ponto de entrada da aplicação
│
└── README.md
```

## 🔌 Endpoints da API

Base URL local: `http://localhost:5000/api`

Rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>`. Rotas marcadas com 👑 exigem, além do login, que o usuário tenha o perfil `admin`.

### Autenticação (`/auth`)
| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra um novo usuário (nome, email, senha) e retorna o token |
| POST | `/auth/login` | Autentica um usuário (email, senha) e retorna o token |
| GET 🔒 | `/auth/me` | Retorna os dados do usuário autenticado (usado para restaurar a sessão) |

### Veículos (`/veiculos`) — 🔒 todas exigem login; cada usuário só vê os próprios veículos
| Método | Rota | Descrição |
|---|---|---|
| GET 🔒 | `/veiculos` | Lista os veículos do usuário logado |
| GET 🔒 | `/veiculos/:id` | Detalhe de um veículo específico |
| POST 🔒 | `/veiculos` | Cadastra um novo veículo |
| PUT 🔒 | `/veiculos/:id` | Atualiza um veículo |
| DELETE 🔒 | `/veiculos/:id` | Remove um veículo (e suas manutenções, em cascata) |

### Manutenções (relacionadas a um Veículo)
| Método | Rota | Descrição |
|---|---|---|
| GET 🔒 | `/veiculos/:veiculoId/manutencoes` | Lista o histórico de manutenções de um veículo |
| POST 🔒 | `/veiculos/:veiculoId/manutencoes` | Registra uma nova manutenção para o veículo |
| PUT 🔒 | `/manutencoes/:id` | Atualiza uma manutenção |
| DELETE 🔒 | `/manutencoes/:id` | Remove uma manutenção |

### Oficinas (`/oficinas`) — leitura pública, escrita restrita a administradores
| Método | Rota | Descrição |
|---|---|---|
| GET | `/oficinas` | Lista todas as oficinas parceiras (rota pública) |
| GET | `/oficinas/:id` | Detalhe de uma oficina (rota pública) |
| POST 🔒👑 | `/oficinas` | Cadastra uma nova oficina (somente admin) |
| PUT 🔒👑 | `/oficinas/:id` | Atualiza uma oficina (somente admin) |
| DELETE 🔒👑 | `/oficinas/:id` | Remove uma oficina (somente admin) |

### Outras
| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Health-check da API |

## 🗄️ Modelagem do banco de dados

Quatro coleções no MongoDB, com os seguintes relacionamentos:

```
User (1) ───< (N) Veiculo (1) ───< (N) Manutencao

Oficina (coleção independente, sem relacionamento direto no banco;
         referenciada apenas pelo nome no campo "oficina" da Manutencao)
```

**User**
| Campo | Tipo | Observações |
|---|---|---|
| nome | String | obrigatório |
| email | String | obrigatório, único |
| senha | String | obrigatório, armazenada com hash (bcrypt) |
| role | String | `user` (padrão) ou `admin` |

**Veiculo**
| Campo | Tipo | Observações |
|---|---|---|
| placa | String | obrigatório |
| modelo | String | obrigatório |
| marca | String | obrigatório |
| cor, chassi, renavam | String | opcionais |
| ano, km | Number | opcionais |
| usuario | ObjectId → `User` | dono do veículo |

**Manutencao**
| Campo | Tipo | Observações |
|---|---|---|
| tipo | String | obrigatório |
| data | Date | obrigatório |
| quilometragem, custo | Number | opcionais |
| oficina, descricao | String | opcionais |
| veiculo | ObjectId → `Veiculo` | veículo ao qual a manutenção pertence |

**Oficina**
| Campo | Tipo | Observações |
|---|---|---|
| nome | String | obrigatório |
| descricao, localizacao, contato, horario, servicos | String | opcionais |

## ▶️ Como rodar o projeto

### 1. Pré-requisitos
- Node.js 18+ instalado
- Uma conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (camada gratuita já é suficiente)

### 2. Configurar o MongoDB Atlas
1. Crie um cluster gratuito (M0) no Atlas.
2. Em **Database Access**, crie um usuário de banco de dados com senha.
3. Em **Network Access**, libere seu IP (ou `0.0.0.0/0` para facilitar a apresentação).
4. Em **Database > Connect > Drivers**, copie a *connection string* (algo como `mongodb+srv://usuario:<password>@cluster0.xxxxx.mongodb.net/`).

### 3. Backend
```bash
cd backend
npm install
cp .env.example .env
```
Edite o `.env` e cole sua connection string do Atlas em `MONGO_URI` (substituindo `<password>` pela senha real e mantendo `/auto-history` como nome do banco no final da URL). Defina também um `JWT_SECRET` qualquer (uma string longa e aleatória).

Popule o banco com um usuário administrador e as oficinas iniciais:
```bash
npm run seed
```
Isso cria o usuário `admin@autohistory.com` / senha `admin123` (use esse login para testar as rotas restritas a administrador, como criar/editar/excluir oficinas).

Inicie o servidor:
```bash
npm run dev
```
A API sobe em `http://localhost:5000`. Teste com `curl http://localhost:5000/api/health`.

### 4. Frontend
Em outro terminal:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
A aplicação abre em `http://localhost:5173` e já está configurada para consumir a API em `http://localhost:5000/api` (ajustável em `frontend/.env`, variável `VITE_API_URL`).

### 4.1. (Opcional) Rodar tudo com um único comando

Depois de já ter feito `npm install` e configurado o `.env` em `backend/` e `frontend/` (passos 3 e 4 acima), você pode rodar os dois servidores de uma vez só a partir da raiz do projeto, em um único terminal:

```bash
# na raiz do projeto (Auto-History/)
npm install
npm run dev
```

Isso usa o pacote `concurrently` para subir o backend e o frontend juntos, com a saída de cada um identificada por um prefixo colorido (`BACKEND` em azul, `FRONTEND` em verde) no mesmo terminal. Para encerrar os dois, basta um `Ctrl+C`.

Esse passo é opcional — rodar `backend` e `frontend` separadamente em dois terminais (passos 3 e 4) continua funcionando normalmente.

### 5. Testando o fluxo completo
1. Acesse `http://localhost:5173`, vá em **Painel** e cadastre uma conta.
2. Cadastre um veículo no Dashboard.
3. Clique no veículo para abrir a página de detalhes e registre uma manutenção.
4. Gere o PDF do histórico pelo botão correspondente.
5. Acesse **Oficinas Parceiras** para ver a lista vinda do backend.
6. (Opcional) Faça login com o usuário admin criado pelo seed e use uma ferramenta como Postman/Insomnia para testar `POST /api/oficinas` e confirmar que um usuário comum recebe `403 Forbidden` na mesma rota.

## 📦 Scripts disponíveis

**Raiz** (`/`)
- `npm install` — instala o `concurrently`, usado para rodar tudo junto
- `npm run install:all` — roda `npm install` dentro de `backend/` e `frontend/` de uma vez
- `npm run dev` — sobe backend e frontend juntos, em um único terminal
- `npm run seed` — atalho para o `seed` do backend
- `npm run build` — atalho para o `build` do frontend

**Backend** (`/backend`)
- `npm run dev` — inicia o servidor com recarga automática (nodemon)
- `npm start` — inicia o servidor em modo produção
- `npm run seed` — cria o usuário admin e popula as oficinas iniciais

**Frontend** (`/frontend`)
- `npm run dev` — inicia o servidor de desenvolvimento (Vite)
- `npm run build` — gera a versão de produção
- `npm run preview` — pré-visualiza a build gerada
- `npm run lint` — executa o ESLint
