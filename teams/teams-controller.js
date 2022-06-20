const mongoose = require('mongoose');
const {to} = require('../to');
const teamModel = mongoose.model('teamModel', 
    { userId: String, team: []});


const cleanTeam = () =>{
    return new Promise(async(resolve, reject) =>{
        await teamModel.deleteMany({}).exec();
        resolve();
    })
}

const bootstrapTeam = (userId) =>{
    return new Promise(async (resolve, reject) =>{
        let newTeam = new teamModel({userId: userId, team: []});
        await newTeam.save();
        resolve();
    })
}

const getTeamOfUser = (userId) =>{
    return new Promise(async (resolve, reject) =>{
        //let team = await teamModel.find({}).exec();
        let [err,dbTeam] = await to(teamModel.findOne({userId: userId}).exec());
        if(err){
            return reject(err);
        }
        resolve(dbTeam.team || []); //return teamsDatabase[userId]
    })
}

const addPokemons = (userId, pokemon) =>{
    return new Promise(async (resolve, reject) =>{
        let [err,dbTeam] = await to(teamModel.findOne({userId: userId}).exec());
        if(err){
            return reject(err);
        }
        if(dbTeam.team.length == 6){
            reject('Ya posees 6 pokemones');
        }else{
            dbTeam.team.push(pokemon);
            await dbTeam.save()
            resolve();
        }   
    });
    
}

const deletePokemon = (userId, index) =>{
    return new Promise(async (resolve, reject) =>{
        let [err,dbTeam] = await to(teamModel.findOne({userId: userId}).exec());
        if(err){
            return reject(err);
        }
        if(dbTeam.team[index]){
            dbTeam.team.splice(index, 1);
        }
        await dbTeam.save()
        resolve();
    });
}

const setTeam = (userId, team) =>{
    return new Promise(async (resolve, reject) =>{
        let [err,dbTeam] = await to(teamModel.findOne({userId: userId}).exec());
        if(err){
            return reject(err);
        }
        dbTeam.team = team;
        await dbTeam.save()
        resolve();
    });
}

exports.bootstrapTeam = bootstrapTeam;
exports.addPokemons = addPokemons;
exports.setTeam = setTeam;
exports.getTeamOfUser = getTeamOfUser;
exports.cleanTeam = cleanTeam;
exports.deletePokemon = deletePokemon;