const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  senha: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['medico', 'paciente', 'admin'],
    default: 'paciente'
  },
  crm: {
    type: String,
    trim: true,
    required: function () { return this.role === 'medico' }
  },
  especialidade: {
    type: String,
    trim: true,
    required: function () { return this.role === 'medico' }
  },
  cpf: {
    type: String,
    trim: true,
    required: function () { return this.role === 'paciente' }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)
