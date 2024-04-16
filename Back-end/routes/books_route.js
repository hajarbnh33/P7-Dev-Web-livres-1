const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const upload = require('../middleware/multer-config')
const sharp = require('../middleware/sharp')
const bookCtrl = require('../controllers/books_route')


router.get('/',bookCtrl.getAllBooks) // récupérer tous les livres
router.post('/',auth,upload,sharp,bookCtrl.createBooks) //créer un livre
router.get('/bestrating',bookCtrl.getBestBooks)// récupérer les 3 meilleurs livres
router.get('/:id',bookCtrl.getBookId)//récupérer un livre par son id
router.post('/:id/rating', auth, bookCtrl.rateBook)//notation du livre
router.put('/:id',auth,upload,sharp,bookCtrl.getModifyBooks)// Modification livre
router.delete('/:id',auth,bookCtrl.deleteBooks)// Supprimer un livre

module.exports = router