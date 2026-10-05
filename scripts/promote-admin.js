require('dotenv').config()

const mongoose = require('mongoose')
const User = require('../src/models/User')

async function promoteAdmin() {
  const email = process.argv[2]
  if (!email) {
    throw new Error('Informe o e-mail de uma conta existente: npm run promote-admin -- email@exemplo.com')
  }

  await mongoose.connect(process.env.MONGO_URI)
  const user = await User.findOneAndUpdate(
    { email: email.trim().toLowerCase() },
    { role: 'admin' },
    { new: true }
  )

  if (!user) {
    throw new Error('Não existe uma conta cadastrada com esse e-mail.')
  }

  console.log(`Perfil administrador habilitado para ${user.email}.`)
}

promoteAdmin()
  .catch(erro => {
    console.error(erro.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())