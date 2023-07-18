const express       = require('express')
const router        = express.Router()

const UserController    = require('../controllers/UserController')
const authenticate      = require('../middleware/authenticate')

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/', UserController.index)
router.post('/show', authenticate, UserController.show)



module.exports = router