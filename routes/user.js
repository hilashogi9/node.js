const { signUp } = require('../controllers/user')

const router = require('express').Router();

router.post('/sign-up', signUp)

module.exports = router;