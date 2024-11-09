const express = require('express');
const { verifyAdmin } = require('../middlewares/auth');
const { createUser, deleteUser, getAllUsers } = require('../controllers/adminController');
const { getUpdateUserPage, updateUser } = require('../controllers/userController')
const router = express.Router();

router.get('/dashboard', verifyAdmin, getAllUsers);
router.get('/update-user/:id', verifyAdmin, getUpdateUserPage);

router.post('/create-user', verifyAdmin, createUser);
router.post('/delete-user', verifyAdmin, deleteUser);
router.post('/update-user', verifyAdmin, updateUser);


module.exports = router;

