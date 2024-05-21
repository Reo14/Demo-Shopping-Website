const express = require('express');
const { signUp, login, updatePassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/update-password', updatePassword);

module.exports = router;
