const http = require('http'); //Cette ligne importe le module HTTP Node.js, qui est utilisé pour créer un serveur HTTP.
const app = require('./app');//importe le module app à partir du fichier app.js local. Ce fichier doit contenir la configuration et la logique de votre application Express

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4000'); //définit le port sur lequel le serveur va écouter
app.set('port', port); //configure Express pour utiliser le port défini dans la variable port.

const errorHandler = error => { //gérer les erreurs qui pourraient survenir lors de la tentative de démarrage du serveur.
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);//ligne crée un serveur HTTP en utilisant la fonction createServer fournie par le module HTTP. Le paramètre app est passé pour gérer les requêtes entrantes via Express.

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);