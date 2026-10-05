require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../frontend')))

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use((erro, req, res, next) => {
  console.error(erro)
  if (res.headersSent) return next(erro)
  const status = erro.name === 'ValidationError' ? 400 : 500
  res.status(status).json({
    mensagem: status === 400 ? 'Dados inválidos.' : 'Erro interno do servidor.'
  })
})

const port = process.env.PORT || 3000

if (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error('Configure MONGO_URI e um JWT_SECRET com pelo menos 32 caracteres no arquivo .env.')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor em http://localhost:${port}`)
      console.log(`Swagger em http://localhost:${port}/api-docs`)
    })
  })
  .catch(erro => {
    console.error('Não foi possível conectar ao MongoDB:', erro.message)
    process.exit(1)
  })
