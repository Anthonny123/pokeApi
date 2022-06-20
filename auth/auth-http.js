const usersController = require('./users');
const jwt = require('jsonwebtoken');
const {to} = require('../to');

const homeAuth = (req, res) =>{
    res.status(200).send("Hola Mundo");
}

const loginAuth = async (req, res) =>{
    if(!req.body){
        return res.status(400).json({message: 'Missing Data'});
    }else if(!req.body.user || !req.body.password){
        return res.status(400).json({message: 'Missing Data'});
    }
    //Comprobamos credenciales
    let [err, response] = await to(usersController.checkUsersCredentials(req.body.user, req.body.password))
     //Si no son validos retorna un error
    if(err || !response){
        return res.status(401).json({message: 'Missing Data'});
    }
    //Si son correctos, generamos un jwt y lo devolvemos
    let user = await usersController.getUserIdFromUserName(req.body.user);
    const token = jwt.sign({userId:user.userId}, 'secretPassword');
    res.status(200).json({token: token});
}

exports.homeAuth = homeAuth;
exports.loginAuth = loginAuth;