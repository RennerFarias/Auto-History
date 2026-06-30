const mongoose = require('mongoose');

const manutencaoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: [true, 'O tipo de manutenção é obrigatório'],
      trim: true,
    },
    quilometragem: {
      type: Number,
      min: [0, 'A quilometragem não pode ser negativa'],
    },
    oficina: {
      type: String,
      trim: true,
      default: '',
    },
    data: {
      type: Date,
      required: [true, 'A data é obrigatória'],
    },
    custo: {
      type: Number,
      min: [0, 'O custo não pode ser negativo'],
      default: 0,
    },
    descricao: {
      type: String,
      trim: true,
      default: '',
    },
    // Relacionamento: uma manutenção pertence a um veículo (1 veículo -> N manutenções)
    veiculo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Veiculo',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Manutencao', manutencaoSchema);
