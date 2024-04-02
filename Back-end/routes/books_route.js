const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const multer= require('../middleware/multer-config')
const bookCtrl = require('../controllers/books_route')

router.get('/',bookCtrl.getAllBooks) // récupérer tous les livres
router.post('/',auth,multer,bookCtrl.createBooks) //créer un livre
router.get('/bestrating',bookCtrl.getBestBooks)// récupérer les 3 meilleurs livres
router.get('/:id',bookCtrl.getBookId)//récupérer un livre par son id
router.put('/:id',auth,multer,bookCtrl.getModifyBooks)// Modification livre
router.delete('/:id',auth,bookCtrl.deleteBooks)// Supprimer un livre

module.exports = router