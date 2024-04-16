const bcrypt = require('bcrypt');
const User = require('../models/user');//Importe le modèle User défini dans le fichier user.js du répertoire models, qui représente la structure des données des utilisateurs dans la base de données.
const jwt = require('jsonwebtoken')// générer des jetons d'authentification

//inscription du nouvel utilisateur
exports.signup= (req,res,next) =>{
    bcrypt.hash(req.body.password, 10) //Utilise la fonction hash de bcrypt pour hacher le mot de passe || 10 spécifie le nombre de tours pour le hachage, ce qui détermine le niveau de sécurité.
    .then(hash =>{
        const user = new User({ //Crée une nouvelle instance de modèle User avec l'e-mail fourni dans le corps de la requête et le mot de passe haché.
            email:req.body.email,
            password:hash
        });
        user.save() //Enregistre l'utilisateur dans la base de données.
        .then(()=> res.status(201).json({message:'Utilisateur crée !'}))
        .catch(error => res.status(400).json({
            error
        }))
    })
    .catch(error => res.status(500).json({
        error
    }));

}

//l'authentification des utilisateurs 
exports.login=(req,res,next) =>{
    User.findOne({email:req.body.email})//Recherche dans la base de données un utilisateur ayant l'e-mail fourni dans le corps de la requête HTTP.
    .then(user =>{
        if(user === null){ //Vérifie si aucun utilisateur correspondant à l'e-mail n'a été trouvé
            res.status(401).json({message:'identifiant/mot de passe incorrecte'})
        }else{
            bcrypt.compare(req.body.password, user.password) //Compare le mot de passe fourni dans le corps de la requête HTTP avec le mot de passe haché stocké dans la base de données pour l'utilisateur trouvé.
            .then(valid =>{
                if(!valid){
                    res.status(401).json({message:'identifiant/mot de passe incorrecte'})
                }else{
                    res.status(200).json({ //Si la comparaison est valide, envoie une réponse avec un code de statut 200 
                        userId: user._id,
                        token: jwt.sign({ //objet JSON contenant l'ID de l'utilisateur et un jeton d'authentification généré à l'aide de jsonwebtoken
                            userId: user._id
                        },
                        process.env.SECRET_RANDOM_TOKEN, //clé secrète (SECRET_RANDOM_TOKEN) définie dans les variables d'environnement et a une durée de validité de 24 heures.
                        {expiresIn:'24h'})
                    })
                }
            })
            .catch(error =>{res.status(500).json({error})})
        }
    })
    .catch(error =>{res.status(500).json({error})})
    
}