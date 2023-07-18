const jwt       = require('jsonwebtoken')

const env = require('../.env')
const secret = env.secretKey


const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization
    const decode = jwt.verify(token, secret)

    req.data = decode
    next()
    }
  catch(error) {
    res.json({
      message: 'Authentication Failed'
    })
  }
}

module.exports = authenticate