const mongoose = require('mongoose');

const veiculoSchema = new mongoose.Schema(
  {
    placa: {
      type: String,
      required: [true, 'A placa é obrigatória'],
      trim: true,
      uppercase: true,
    },
    modelo: {
      type: String,
      required: [true, 'O modelo é obrigatório'],
      trim: true,
    },
    marca: {
      type: String,
      required: [true, 'A marca é obrigatória'],
      trim: true,
    },
    cor: {
      type: String,
      trim: true,
      default: '',
    },
    ano: {
      type: Number,
      min: [1900, 'Ano inválido'],
      max: [2100, 'Ano inválido'],
    },
    chassi: {
      type: String,
      trim: true,
      default: '',
    },
    km: {
      type: Number,
      min: [0, 'A quilometragem não pode ser negativa'],
      default: 0,
    },
    renavam: {
      type: String,
      trim: true,
      default: '',
    },
    // Dono do veículo: cada usuário só enxerga/edita os próprios veículos
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Evita que o mesmo usuário cadastre a mesma placa duas vezes
veiculoSchema.index({ placa: 1, usuario: 1 }, { unique: true });

module.exports = mongoose.model('Veiculo', veiculoSchema);
