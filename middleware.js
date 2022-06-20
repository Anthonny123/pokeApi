const authmiddleware = require('./auth/auth');
const bodyParser = require('body-parser');

const setupMiddlewares = (app) =>{
    app.use(bodyParser.json());
    authmiddleware.init(); //Middleware para la auth de los usuarios
    app.use(authmiddleware.protectWithJwt);  //protocolo de auth JWT 
}

exports.setupMiddlewares = setupMiddlewares;