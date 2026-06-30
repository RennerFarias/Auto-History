const express = require('express');
const { register, login, me } = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validarRegistro, validarLogin } = require('../middlewares/validators');

const router = express.Router();

router.post('/register', validarRegistro, register);
router.post('/login', validarLogin, login);
router.get('/me', protect, me);

module.exports = router;
