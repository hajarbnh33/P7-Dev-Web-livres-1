const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/auth_route')

router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login)




module.exports = router;