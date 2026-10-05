const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ mensagem: 'Autenticação necessária.' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado.' })
  }
}

module.exports = authMiddleware
