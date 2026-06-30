require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const veiculoRoutes = require('./routes/veiculoRoutes');
const manutencaoRoutes = require('./routes/manutencaoRoutes');
const oficinaRoutes = require('./routes/oficinaRoutes');

const app = express();

// Conecta ao MongoDB
connectDB();

// Middlewares globais
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rota de health-check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mensagem: 'API Auto-History no ar 🚗' });
});

// Rotas da aplicação
app.use('/api/auth', authRoutes);
app.use('/api/veiculos', veiculoRoutes);
app.use('/api/manutencoes', manutencaoRoutes);
app.use('/api/oficinas', oficinaRoutes);

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

// Middleware central de erros (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
