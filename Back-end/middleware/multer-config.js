const multer = require('multer');

const storage = multer.memoryStorage(); // stockage en mémoire pour stocker les fichiers téléchargés temporairement en utilisant 

const upload = multer({ storage: storage }).single('image');//pour indiquer qu'un seul fichier avec le nom de champ "image" sera téléchargé à la fois.

module.exports = upload;

