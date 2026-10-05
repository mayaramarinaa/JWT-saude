const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

function validarCadastro(dados) {
  if (!dados.nome || !dados.email || !dados.senha || !dados.role) {
    return 'Preencha nome, e-mail, senha e perfil.'
  }

  if (!['medico', 'paciente'].includes(dados.role)) {
    return 'Perfil inválido. Escolha médico ou paciente.'
  }

  if (!/^\S+@\S+\.\S+$/.test(dados.email)) {
    return 'Informe um e-mail válido.'
  }

  if (dados.senha.length < 8) {
    return 'A senha deve ter pelo menos 8 caracteres.'
  }

  if (dados.role === 'medico' && (!dados.crm || !dados.especialidade)) {
    return 'CRM e especialidade são obrigatórios para médicos.'
  }

  if (dados.role === 'paciente' && !dados.cpf) {
    return 'CPF é obrigatório para pacientes.'
  }

  return null
}

function dadosPublicos(user) {
  return {
    id: user._id,
    nome: user.nome,
    email: user.email,
    role: user.role,
    crm: user.crm,
    especialidade: user.especialidade,
    cpf: user.cpf
  }
}

async function register(req, res) {
  const body = req.body || {}
  const erro = validarCadastro(body)
  if (erro) {
    return res.status(400).json({ mensagem: erro })
  }

  try {
    const senhaHash = await bcrypt.hash(body.senha, 10)
    const user = await User.create({
      nome: body.nome.trim(),
      email: body.email.trim().toLowerCase(),
      senha: senhaHash,
      role: body.role,
      crm: body.crm,
      especialidade: body.especialidade,
      cpf: body.cpf
    })

    return res.status(201).json(dadosPublicos(user))
  } catch (erroCadastro) {
    if (erroCadastro.code === 11000) {
      return res.status(409).json({ mensagem: 'Este e-mail já está cadastrado.' })
    }
    throw erroCadastro
  }
}

async function login(req, res) {
  const body = req.body || {}
  if (!body.email || !body.senha) {
    return res.status(400).json({ mensagem: 'Informe e-mail e senha.' })
  }

  const user = await User.findOne({
    email: body.email.trim().toLowerCase()
  })

  if (!user) {
    return res.status(401).json({
      mensagem: 'E-mail ou senha inválidos'
    })
  }

  const senhaValida = await bcrypt.compare(
    body.senha,
    user.senha
  )

  if (!senhaValida) {
    return res.status(401).json({
      mensagem: 'E-mail ou senha inválidos'
    })
  }

  const token = jwt.sign(
    {
      id: user._id,
      nome: user.nome,
      role: user.role,
      crm: user.crm,
      especialidade: user.especialidade,
      cpf: user.cpf
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )

  res.json({
    token,
    usuario: dadosPublicos(user)
  })
}

module.exports = {
  register,
  login,
  validarCadastro
}