const Books = require('../models/books');


exports.createBooks = (req,res,next)=>{
    const bookObject = JSON.parse(req,body.books);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Books ({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    book.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
}