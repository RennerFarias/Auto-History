const mongoose = require('mongoose');

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI não foi definida no arquivo .env');
    }

    await mongoose.connect(uri);

    console.log(`✅ MongoDB conectado: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
