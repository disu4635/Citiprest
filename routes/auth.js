const express = require('express');
const { login, logout } = require('../controllers/authController');
const router = express.Router();
const { getLogin } = require('../controllers/authController');

// Ruta de login
router.get('/login', getLogin);

router.post('/login', login);
router.get('/logout', logout);

module.exports = router;

