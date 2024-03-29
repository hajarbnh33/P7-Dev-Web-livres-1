const express = require('express');
const router = express.Router();
const multer= require('../middleware/multer-config')
const auth = require('../middleware/auth')
const bookCtrl = require('../controllers/books_route')


router.post('/',auth,multer,bookCtrl.createBooks)

module.exports = router