const express = require('express');
const { verifyUser } = require('../middlewares/auth');
const router = express.Router();
const { getUserDashboard, updateUserSaldo }  = require('../controllers/userController')

router.get('/dashboard/:userId', verifyUser, getUserDashboard);

router.post('/dashboard/:userId/update-saldo', verifyUser, updateUserSaldo);


module.exports = router;
