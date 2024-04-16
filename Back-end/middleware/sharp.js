const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

module.exports = (req, res, next) => {
    if (!req.file || !req.file.buffer) { //Vérifie si req.file est défini et contient des données. 
        return res.status(400).json({ error: 'Aucun fichier.' });
    }

    const extension = MIME_TYPES[req.file.mimetype];//Obtient l'extension de fichier correspondant au type MIME du fichier téléchargé à partir de req.file.mimetype.
    if (!extension) { //Vérifie si l'extension de fichier est prise en charge.
        return res.status(400).json({ error: 'Format non pris en charge' });
    }

    const timestamp = Date.now();// retourne le nombre de millisecondes écoulées depuis le 1er janvier 1970 00:00:00 UTC jusqu'à la date actuelle. Cela permet d'obtenir un timestamp unique à chaque fois que cette ligne est exécutée.
    const fileName = `image_${timestamp}.webp`;// Le nom est composé de la chaîne "image_", suivie du timestamp généré précédemment, puis d'un point (.) et de l'extension du fichier récupérée à partir du type MIME de l'image téléchargée.

    sharp(req.file.buffer)//un objet Sharp à partir du buffer de l'image téléchargée
        .resize(800, 800)
        .toFormat('webp')
        .toBuffer((err, buffer, info) => {//Convertit l'image en buffer après redimensionnement.
            if (err) {
                return res.status(500).json({ error: 'Erreur traitement image.' });
            }
            
            // Écrivez le buffer dans le fichier sur le serveur, dans le répertoire images. Une fois l'écriture terminée, appelle next() pour passer au middleware suivant.
            fs.writeFile(path.join(__dirname, '..', 'images', fileName), buffer, err => {
                if (err) {
                    return res.status(500).json({ error: 'Erreur sauvegarde image.' });
                }
                req.file.filename = fileName;
                next();
            });
        });
};