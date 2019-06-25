const checkJWT = ({ jwt, jwtSecret }) => (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.indexOf('Bearer ') === 0) {
    const token = req.headers.authorization.split('Bearer ').join('')
    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        res.status(401)
        res.send({
          error: 'Token inválido!'
        })
      } else {
        res.locals.user = decoded
        next()
      }
    })
  } else {
    res.status(401)
    res.send({
      error: 'Token inválido!'
    })
  }
}

const injectUserFromToken = ({ jwt, jwtSecret }) => (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.indexOf('Bearer ') === 0) {
    const token = req.headers.authorization.split('Bearer ').join('')

    jwt.verify(token, jwtSecret, (err, decoded) => {
      if (err) {
        next()
      } else {
        res.locals.user = decoded
        next()
      }
    })
  } else {
    next()
  }
}

module.exports = { checkJWT, injectUserFromToken }