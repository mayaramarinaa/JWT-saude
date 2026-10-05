const api = '/api'

function atualizarCamposPerfil() {
  const ehMedico = document.getElementById('perfilCadastro').value === 'medico'
  document.getElementById('camposMedico').classList.toggle('hidden', !ehMedico)
  document.getElementById('camposPaciente').classList.toggle('hidden', ehMedico)
  document.getElementById('crmCadastro').required = ehMedico
  document.getElementById('especialidadeCadastro').required = ehMedico
  document.getElementById('cpfCadastro').required = !ehMedico
}

async function cadastrar() {
  const status = document.getElementById('statusCadastro')
  const body = {
    nome: document.getElementById('nomeCadastro').value,
    email: document.getElementById('emailCadastro').value,
    senha: document.getElementById('senhaCadastro').value,
    role: document.getElementById('perfilCadastro').value,
    cpf: document.getElementById('cpfCadastro').value,
    crm: document.getElementById('crmCadastro').value,
    especialidade: document.getElementById('especialidadeCadastro').value
  }

  try {
    const resposta = await fetch(`${api}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const dados = await resposta.json()

    if (!resposta.ok) {
      status.innerText = dados.mensagem || 'Não foi possível criar a conta.'
      return
    }

    status.innerText = `Conta de ${dados.role} criada. Você já pode entrar.`
    document.getElementById('formCadastro').reset()
    atualizarCamposPerfil()
  } catch (erro) {
    status.innerText = 'Não foi possível conectar ao servidor.'
  }
}

async function login() {
  const email = document.getElementById('emailLogin').value
  const senha = document.getElementById('senhaLogin').value
  const status = document.getElementById('statusLogin')

  let resposta
  let dados
  try {
    resposta = await fetch(`${api}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    })
    dados = await resposta.json()
  } catch (erro) {
    status.innerText = 'Não foi possível conectar ao servidor.'
    return
  }


  if (!resposta.ok) {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')

    status.innerText = dados.mensagem

    return
  }

  localStorage.setItem('token', dados.token)
  localStorage.setItem('usuario', JSON.stringify(dados.usuario))

  window.location.href = '/usuarios.html'
}

atualizarCamposPerfil()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}