const jwt = require('jsonwebtoken')

module.exports = (req,res, next) => {
    try{
        if (!req.headers.authorization) { //Vérifie si l'en-tête Authorization est présent dans la requête. Si ce n'est pas le cas, une erreur est levée avec le message 
            throw new Error('Authorization header is missing');
        }
        const token = req.headers.authorization.split(' ')[1];//Extrait le token JWT de l'en-tête Authorization. L'en-tête Authorization est généralement sous la forme Bearer <token>, donc cette ligne divise la chaîne pour obtenir le token uniquement.
        const decodedToken = jwt.verify(token, process.env.SECRET_RANDOM_TOKEN);//Décode le token JWT à l'aide de la clé secrète 'RANDOM_TOKEN_SECRET'. Cette opération vérifie la validité et l'intégrité du token. 
        const userId = decodedToken.userId;
        req.user ={
            id: userId
        };
    }catch(error){
        res.status(401).json({error: error.message})
    }
    next();
}