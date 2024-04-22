const Books = require('../models/books');
const fs = require('fs');

//créer un nouveau livre 
exports.createBooks = (req,res,next)=>{
    const bookObject = JSON.parse(req.body.book);//Analyse le corps de la requête (req.body.book) pour obtenir les détails du livre sous forme d'objet JavaScript.
    delete bookObject._id;//Supprime la propriété _id de l'objet du livre, si elle existe.
    delete bookObject._userId;//Supprime la propriété _userid de l'objet du livre, si elle existe.
    const book = new Books ({//Crée une nouvelle instance du modèle de livre avec les détails du livre fournis dans bookObject. L'ID de l'utilisateur et l'URL de l'image sont également ajoutés à l'objet du livre.
        ...bookObject,
        userId: req.user.id,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });         
    book.save()//Enregistre le nouveau livre dans la base de données. 
    .then(() => { res.status(201).json({message: 'Livre enregistré !'})})
    .catch(error => { res.status(400).json( { error })})    
}

//récupérer tous les livres
exports.getAllBooks = (req,res,next) =>{ //gère la récupération de tous les livres dans la base de données
    Books.find() //écupérer tous les documents de la collection des livres dans la base de données.
        .then(books=>{
            res.status(200).json(books)//La variable books contiendra la liste des livres récupérés depuis la base de données.
        })
        .catch(error => { res.status(400).json( { error })})
}

//récupérer un livre par son ID
exports.getBookId =(req,res,next)=>{ //gère la récupération d'un livre spécifique par son ID
    const bookId = req.params.id;//Cette ligne extrait l'identifiant du livre à partir des paramètres de la requête. 

    Books.findById(bookId)//trouver un livre dans la base de données en utilisant son identifiant.
        .then(book=>{//La variable book contiendra le livre récupéré depuis la base de données.
            if(!book){//Cette ligne vérifie si aucun livre n'a été trouvé dans la base de données pour l'identifiant fourni.
                return res.status(404).json({message:'Livre introuvable'})
            }
            res.status(200).json(book);//Si un livre est trouvé, cette ligne envoie une réponse avec un code de statut HTTP 200 (OK) et envoie le livre récupéré au format JSON dans le corps de la réponse.
        })
        .catch(error => { res.status(400).json( { error })})
}

//récupérer les 3 livres avec la meilleur note
exports.getBestBooks = (req,res,next) =>{ //gère la récupération des trois livres avec la meilleure note.
    Books.find().sort({averageRating: -1}).limit(3)//rechercher tous les documents (livres) dans la collection de la base de données associée au modèle Books. Ensuite, la méthode sort() est utilisée pour trier les livres par ordre décroissant de leur note moyenne (averageRating). Enfin, la méthode limit(3) est utilisée pour limiter les résultats à trois livres.
        .then(books=>{//La variable books contiendra un tableau contenant les trois livres avec la meilleure note récupérés depuis la base de données
            res.status(200).json(books)
        })
        .catch(error => { res.status(400).json( { error })})
}

//mise à jours du livre
exports.getModifyBooks = (req, res, next)=>{
    const bookObject = req.file ? {//Cette ligne crée un objet bookObject qui contiendra les détails du livre à modifier.
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`// l'objet bookObject est initialisé avec les données du livre à partir de req.body, et l'URL de l'image est construite à partir des informations de la requête
    } :{ ...req.body}
    delete bookObject._userId //Cette ligne supprime la clé _userId de l'objet bookObject
    Books.findOne({_id: req.params.id})//Cette ligne recherche le livre dans la base de données en utilisant son ID. 
        .then((book)=>{
            if(book.userId != req.user.id){
                res.status(403).JSON({message: '403: unauthorized request'})
            }else{
                Books.updateOne({_id:req.params.id}, {...bookObject,_id:req.params.id})//Cette ligne met à jour le livre dans la base de données. Elle utilise updateOne pour trouver le livre par son ID (req.params.id) et le mettre à jour avec les nouvelles données fournies dans bookObject
                .then(()=> res.status(200).json({message:'Livre modifié'}))
                .catch(error => { res.status(400).json( { error })})
            }
        })
        .catch(error => { res.status(400).json( { error })})

}

//DELETE
exports.deleteBooks = (req, res,next) => {
    Books.findOne({ _id: req.params.id}) //Cette ligne recherche le livre dans la base de données en utilisant son ID
        .then(book => {
            if (book.userId != req.user.id) { //Cette ligne vérifie si l'ID de l'utilisateur qui a créé le livre (book.userId) est différent de l'ID de l'utilisateur authentifié (req.auth.userId).
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = book.imageUrl.split('/images/')[1];//Cette ligne extrait le nom du fichier image à partir de l'URL de l'image du livre.
                fs.unlink(`images/${filename}`, () => {//Cela supprime le fichier image associé au livre. La fonction fs.unlink est utilisée pour supprimer un fichier.
                    Books.deleteOne({_id: req.params.id})//Cette ligne supprime le livre de la base de données en utilisant son ID. 
                        .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };

// Notation du livre
 exports.rateBook = async (req, res) => {
    try {
        const { userId, rating } = req.body; // Extrait les propriétés userId et rating de l'objet req.body
        const bookId = req.params.id;// Extrait l'ID du livre 
    
        // Vérifie si la note est valide (entre 0 et 5)
        if (rating < 0 || rating > 5) { 
            return res.status(400).json({ error: "La note doit être comprise entre 0 et 5." });
        }

        // Recherchez le livre dans la base de données
        const book = await Books.findById(bookId);//Recherche le livre correspondant à l'ID dans la base de données en utilisant la méthode findById 
        if (!book) {
            return res.status(404).json({ error: "Livre non trouvé." });
        }

        // Vérifiez si l'utilisateur est authentifié
        if (!userId) { //Vérifie si l'ID de l'utilisateur n'est pas fourni. 
            return res.status(401).json({ error});
        }

        // Vérifiez si l'utilisateur a déjà noté ce livre
        const existRating = book.ratings.find(rating => rating.userId === userId);
        if (existRating) {
            return res.status(400).json({ message: "Vous avez déjà noté ce livre." });
        }

        // Ajoutez la note à la liste des notes du livre
        book.ratings.push({ userId, grade: rating });//Ajoute la nouvelle note dans le tableau ratings du livre avec l'ID de l'utilisateur et la note fournie

        // mise à jour la note moyenne "averageRating"
        const totalRatings = book.ratings.length;//Calcule le nombre total de notes pour ce livre.
        const sumRatings = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);//Calcule la somme des notes: la méthode reduce pour additionner toutes les notes.
        book.averageRating = (sumRatings / totalRatings).toFixed(2); //2 décimales.

        // Enregistrez les modifications dans la base de données
        await book.save();

        // Renvoyez le livre mis à jour en réponse
        res.status(200).json(book);
    } catch (error) {
        // Gérez les erreurs
        console.error(error);
        res.status(500).json({ error});
    }
};