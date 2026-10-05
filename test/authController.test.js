const test = require('node:test')
const assert = require('node:assert/strict')
const { validarCadastro } = require('../src/controllers/authController')

test('aceita cadastro de paciente com CPF', () => {
  assert.equal(validarCadastro({
    nome: 'Ana Silva',
    email: 'ana@example.com',
    senha: 'senha-segura',
    role: 'paciente',
    cpf: '12345678900'
  }), null)
})

test('aceita cadastro médico com CRM e especialidade', () => {
  assert.equal(validarCadastro({
    nome: 'Dr. João',
    email: 'joao@example.com',
    senha: 'senha-segura',
    role: 'medico',
    crm: '12345-SP',
    especialidade: 'Cardiologia'
  }), null)
})

test('impede cadastro público com perfil administrador', () => {
  assert.match(validarCadastro({
    nome: 'Admin',
    email: 'admin@example.com',
    senha: 'senha-segura',
    role: 'admin'
  }), /Perfil inválido/)
})

test('exige dados específicos de cada perfil', () => {
  assert.match(validarCadastro({
    nome: 'Ana', email: 'ana@example.com', senha: 'senha-segura', role: 'paciente'
  }), /CPF/)
  assert.match(validarCadastro({
    nome: 'João', email: 'joao@example.com', senha: 'senha-segura', role: 'medico'
  }), /CRM e especialidade/)
})

test('valida formato do e-mail e tamanho mínimo da senha', () => {
  const cadastro = { nome: 'Ana', email: 'invalido', senha: 'curta', role: 'paciente', cpf: '123' }
  assert.match(validarCadastro(cadastro), /e-mail válido/)
  cadastro.email = 'ana@example.com'
  assert.match(validarCadastro(cadastro), /8 caracteres/)
})