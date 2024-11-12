const express = require('express');
const { verifyUser } = require('../middlewares/auth');
const router = express.Router();
const { getUserDashboard, updateUserSaldo, generarTarjeta, eliminarTarjeta }  = require('../controllers/userController')

router.get('/dashboard/:userId', verifyUser, getUserDashboard);

router.post('/dashboard/:userId/update-saldo', verifyUser, updateUserSaldo);
router.post('/dashboard/:userId/generar-tarjeta', verifyUser, generarTarjeta);
router.post('/dashboard/:userId/eliminar-tarjeta', verifyUser, eliminarTarjeta);

module.exports = router;
