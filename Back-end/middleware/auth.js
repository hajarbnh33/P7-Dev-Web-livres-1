const jwt = require('jsonwebtoken')

module.exports = (req,res, next) => {
    try{
        if (!req.headers.authorization) { //Vérifie si l'en-tête Authorization est présent dans la requête. 
            throw new Error('Authorization header is missing');
        }
        const token = req.headers.authorization.split(' ')[1];//Extrait le token JWT de l'en-tête Authorization.
        const decodedToken = jwt.verify(token, process.env.SECRET_RANDOM_TOKEN);//vérifie la validité du token
        const userId = decodedToken.userId;//si token valide on extrait l'id de l'utilisateur
        req.user ={
            id: userId
        };
    }catch(error){
        res.status(401).json({error: error.message})
    }
    next();
}