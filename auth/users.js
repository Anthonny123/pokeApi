const uuid = require('uuid');
const crypt = require('../crypt.js');
const teams = require('../teams/teams-controller');
const {to} = require('../to');
const mongoose = require('mongoose');

const userModel = mongoose.model('userModel', 
    { userName: String, password: String, userId: String})

const cleanUser = ()=>{
    return new Promise(async (resolve, reject) =>{
        await userModel.deleteMany({}).exec();
        resolve();
    });
}

const registerUser = (userName, password) => {
    return new Promise(async (resolve, reject) =>{
         //Hasheamos el pasword
        let hashedPwd = crypt.hashPasswordSync(password);
        //Creamos un nuevo usuario, se genera la id y rellenamos los campos con la informacion proporcionada por el usuario
        let userId = uuid.v4();
        let newUser = new userModel({
            userName: userName,
            password: hashedPwd,
            userId: userId
        })
        await newUser.save()
        await teams.bootstrapTeam(userId);
        resolve();
    });
}

registerUser('anthonny', '1234');

const getUser = (userId) =>{
    return new Promise(async (resolve, reject) =>{
        let [err, result] = await to(userModel.findOne({userId: userId}).exec());
        if(err){
            return reject(err);
        }
        resolve(result);
    })
}

const getUserIdFromUserName = (userName) =>{
    return new Promise(async (resolve, reject) =>{
        let [err, result] = await to(userModel.findOne({userName: userName}).exec());
        if(err){
            return reject(err);
        }
        resolve(result);
    })
}

const checkUsersCredentials = (userName, password) =>{
    return new Promise(async (resolve, reject) =>{
        //Comprobar que las credenciales son correctas
        let [err, user] = await to(getUserIdFromUserName(userName));
        if(!err || user){
            crypt.comparePassword(password, user.password, (err, result) =>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            });
        }else{
            reject('Missing User');
        }
    });
}

exports.registerUser = registerUser;
exports.checkUsersCredentials = checkUsersCredentials;
exports.getUserIdFromUserName = getUserIdFromUserName;
exports.getUser = getUser;
exports.cleanUser = cleanUser;