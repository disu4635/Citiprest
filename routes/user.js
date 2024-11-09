const express = require('express');
const { verifyUser } = require('../middlewares/auth');
const router = express.Router();
const { getUserDashboard }  = require('../controllers/userController')

router.get('/dashboard', verifyUser, getUserDashboard);

module.exports = router;
