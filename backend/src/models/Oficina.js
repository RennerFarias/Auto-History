const mongoose = require('mongoose');

const oficinaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'O nome da oficina é obrigatório'],
      trim: true,
    },
    descricao: {
      type: String,
      trim: true,
      default: '',
    },
    localizacao: {
      type: String,
      trim: true,
      default: '',
    },
    contato: {
      type: String,
      trim: true,
      default: '',
    },
    horario: {
      type: String,
      trim: true,
      default: '',
    },
    servicos: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Oficina', oficinaSchema);
