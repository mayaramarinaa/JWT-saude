const api = '/api'
const token = localStorage.getItem('token')

if (!token) {
  window.location.href = '/'
}

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  window.location.href = '/'
}

async function listarUsuarios() {
  const resposta = await fetch(`${api}/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (resposta.status === 401 || resposta.status === 403) {
    logout()
    return
  }

  const usuarios = await resposta.json()
  const div = document.getElementById('usuarios')
  div.replaceChildren()

  usuarios.forEach(usuario => {
    const item = document.createElement('article')
    item.className = 'user-item'
    const info = document.createElement('div')
    info.className = 'user-info'
    const avatar = document.createElement('div')
    avatar.className = 'avatar'
    avatar.textContent = usuario.nome.charAt(0).toUpperCase()
    const details = document.createElement('div')
    const name = document.createElement('strong')
    name.textContent = usuario.nome
    const email = document.createElement('span')
    email.textContent = usuario.email
    const role = document.createElement('small')
    role.textContent = usuario.role
    details.append(name, email, role)
    info.append(avatar, details)

    const actions = document.createElement('div')
    actions.className = 'actions'
    const editButton = document.createElement('button')
    editButton.className = 'secondary small'
    editButton.textContent = 'Editar'
    editButton.addEventListener('click', () => editarUsuario(usuario))
    const deleteButton = document.createElement('button')
    deleteButton.className = 'danger small'
    deleteButton.textContent = 'Excluir'
    deleteButton.addEventListener('click', () => removerUsuario(usuario._id))
    actions.append(editButton, deleteButton)
    item.append(info, actions)
    div.append(item)
  })
}

function atualizarCamposNovoUsuario() {
  const role = document.getElementById('roleNovo').value
  const ehMedico = role === 'medico'
  document.getElementById('camposMedicoNovo').classList.toggle('hidden', !ehMedico)
  document.getElementById('camposPacienteNovo').classList.toggle('hidden', role !== 'paciente')
  document.getElementById('crmNovo').required = ehMedico
  document.getElementById('especialidadeNovo').required = ehMedico
  document.getElementById('cpfNovo').required = role === 'paciente'
}

async function criarUsuario() {
  const body = {
    nome: document.getElementById('nomeNovo').value,
    email: document.getElementById('emailNovo').value,
    senha: document.getElementById('senhaNovo').value,
    role: document.getElementById('roleNovo').value,
    cpf: document.getElementById('cpfNovo').value,
    crm: document.getElementById('crmNovo').value,
    especialidade: document.getElementById('especialidadeNovo').value
  }

  const resposta = await fetch(`${api}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  const dados = await resposta.json()
  if (!resposta.ok) {
    document.getElementById('statusCrud').innerText = dados.mensagem || 'Não foi possível criar o usuário.'
    return
  }

  document.getElementById('nomeNovo').value = ''
  document.getElementById('emailNovo').value = ''
  document.getElementById('senhaNovo').value = ''
  document.getElementById('roleNovo').value = 'paciente'
  document.getElementById('cpfNovo').value = ''
  document.getElementById('crmNovo').value = ''
  document.getElementById('especialidadeNovo').value = ''
  atualizarCamposNovoUsuario()
  document.getElementById('statusCrud').innerText = 'Usuário criado com sucesso'

  listarUsuarios()
}

async function editarUsuario(usuario) {
  const nome = prompt('Nome', usuario.nome)
  if (nome === null) return
  const email = prompt('E-mail', usuario.email)
  if (email === null) return
  const role = prompt('Perfil (paciente, medico ou admin)', usuario.role)
  if (role === null) return
  const cpf = role === 'paciente' ? prompt('CPF', usuario.cpf || '') : ''
  const crm = role === 'medico' ? prompt('CRM', usuario.crm || '') : ''
  const especialidade = role === 'medico' ? prompt('Especialidade', usuario.especialidade || '') : ''
  if (cpf === null || crm === null || especialidade === null) return

  const resposta = await fetch(`${api}/users/${usuario._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      nome,
      email,
      role,
      cpf,
      crm,
      especialidade
    })
  })

  if (!resposta.ok) {
    const dados = await resposta.json()
    document.getElementById('statusCrud').innerText = dados.mensagem || 'Não foi possível editar o usuário.'
    return
  }

  listarUsuarios()
}

async function removerUsuario(id) {
  const resposta = await fetch(`${api}/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!resposta.ok) {
    const dados = await resposta.json()
    document.getElementById('statusCrud').innerText = dados.mensagem || 'Não foi possível excluir o usuário.'
    return
  }

  listarUsuarios()
}

async function carregarPerfil() {
  if (!token) return

  const resposta = await fetch(`${api}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  if (!resposta.ok) {
    logout()
    return
  }

  const usuario = await resposta.json()
  const ehAdmin = usuario.role === 'admin'
  const rotulos = { medico: 'Médico', paciente: 'Paciente', admin: 'Administrador' }
  document.getElementById('subtituloPerfil').textContent = rotulos[usuario.role] || 'Conta'
  document.getElementById('saudacaoPerfil').textContent = `Área do ${rotulos[usuario.role] || 'usuário'}`
  document.getElementById('tituloPerfil').textContent = `Olá, ${usuario.nome}`
  document.getElementById('descricaoPerfil').textContent = ehAdmin
    ? 'Gerencie os cadastros de pacientes e médicos.'
    : 'Confira os dados associados à sua conta.'

  const campos = [
    ['Nome', usuario.nome],
    ['E-mail', usuario.email],
    ['Perfil', rotulos[usuario.role] || usuario.role],
    ['CPF', usuario.cpf],
    ['CRM', usuario.crm],
    ['Especialidade', usuario.especialidade]
  ]
  const details = document.getElementById('dadosPerfil')
  details.replaceChildren()
  campos.filter(([, valor]) => valor).forEach(([rotulo, valor]) => {
    const term = document.createElement('dt')
    term.textContent = rotulo
    const description = document.createElement('dd')
    description.textContent = valor
    details.append(term, description)
  })

  if (ehAdmin) {
    document.getElementById('areaAdmin').classList.remove('hidden')
    document.getElementById('atualizarLista').classList.remove('hidden')
    listarUsuarios()
  }
}

document.getElementById('roleNovo').addEventListener('change', atualizarCamposNovoUsuario)
atualizarCamposNovoUsuario()
carregarPerfil()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
}