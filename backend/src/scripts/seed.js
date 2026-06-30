// Script de seed: cria um usuário administrador e popula a coleção de oficinas
// com os dados que antes estavam fixos (hardcoded) no frontend.
//
// Como rodar (de dentro da pasta backend/):
//   npm run seed

require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Oficina = require('../models/Oficina');

const oficinasIniciais = [
  {
    nome: 'Oficina AutoTech',
    descricao:
      'Especializada em manutenção de veículos modernos, a AutoTech oferece serviços de alta qualidade para garantir o desempenho do seu carro.',
    localizacao: 'Rua das Flores, 123 - Centro',
    contato: '(11) 1234-5678',
    horario: 'Segunda a sexta, das 8h às 18h',
    servicos: 'Revisão geral, troca de óleo, alinhamento e balanceamento, diagnóstico eletrônico, entre outros.',
  },
  {
    nome: 'Oficina Mecânica Rápida',
    descricao:
      'Com uma equipe experiente, a Oficina Mecânica Rápida é conhecida por sua eficiência e atendimento ágil, ideal para quem precisa de reparos rápidos.',
    localizacao: 'Rua das Flores, 123 - Centro',
    contato: '(11) 1234-5678',
    horario: 'Segunda a sexta, das 8h às 18h',
    servicos: 'Revisão geral, troca de óleo, alinhamento e balanceamento, diagnóstico eletrônico, entre outros.',
  },
  {
    nome: 'Oficina AutoMaster',
    descricao:
      'A AutoMaster é uma oficina de confiança, oferecendo uma ampla gama de serviços para manter seu veículo em perfeito estado.',
    localizacao: 'Rua das Flores, 123 - Centro',
    contato: '(11) 1234-5678',
    horario: 'Segunda a sexta, das 8h às 18h',
    servicos: 'Revisão geral, troca de óleo, alinhamento e balanceamento, diagnóstico eletrônico, entre outros.',
  },
];

const ADMIN_EMAIL = 'admin@autohistory.com';
const ADMIN_SENHA = 'admin123';

async function seed() {
  await connectDB();

  // --- Usuário admin ---
  const adminExistente = await User.findOne({ email: ADMIN_EMAIL });
  if (!adminExistente) {
    await User.create({
      nome: 'Administrador',
      email: ADMIN_EMAIL,
      senha: ADMIN_SENHA,
      role: 'admin',
    });
    console.log(`✅ Usuário admin criado -> email: ${ADMIN_EMAIL} | senha: ${ADMIN_SENHA}`);
  } else {
    console.log('ℹ️  Usuário admin já existia, nada foi alterado.');
  }

  // --- Oficinas ---
  const totalOficinas = await Oficina.countDocuments();
  if (totalOficinas === 0) {
    await Oficina.insertMany(oficinasIniciais);
    console.log(`✅ ${oficinasIniciais.length} oficinas inseridas.`);
  } else {
    console.log('ℹ️  Já existem oficinas cadastradas, nada foi alterado.');
  }

  console.log('🌱 Seed finalizado.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Erro ao rodar o seed:', err);
  process.exit(1);
});
