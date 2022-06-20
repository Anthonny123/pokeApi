const teamsController = require('../teams/teams-controller');
const {getUser} = require('../auth/users');
const axios = require('axios').default;
const {to} = require('../to');

const getTeamFromUser = async (req, res) =>{
    let user = await getUser(req.user.userId);
    let [teamError, team] = await to (teamsController.getTeamOfUser(req.user.userId));
    if(teamError){
        return res.status(400).json({message: err});
    }
    res.status(200).json({
        trainer: user.userName,
        team: team
    });
}

const setTeamToUser = async (req, res) =>{
    let [err, resp] = await to(teamsController.setTeam(req.user.userId, req.body.team));
    if(err){
        return res.status(400).json({message: err});
    }
    res.status(200).send();
}

const addPokemonsHandler = async (req, res) =>{
    let pokemonName = req.body.name;
    let [pokeApiError, pokeApiResponse] = await to (axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`))
    if(pokeApiError){
        return res.status(400).json({message: pokeApiError});
    }
    let pokemon = {
        name: pokemonName,
        pokedexNumber: pokeApiResponse.data.id
    }
    let [errorAdd, response]= await to(teamsController.addPokemons(req.user.userId, pokemon));
    console.log(`errorAdd: ${errorAdd}`);
    if(errorAdd){
        return res.status(400).json({message: 'Ya tienes 6 pokemons'});
    }else{
        return res.status(201).json(pokemon);
    }
    
}

const deletePokemon = async (req, res) =>{
    await teamsController.deletePokemon(req.user.userId, req.params.pokeid);
    res.status(200).send();
}

exports.getTeamFromUser = getTeamFromUser;
exports.setTeamToUser = setTeamToUser;
exports.addPokemonsHandler = addPokemonsHandler;
exports.deletePokemon = deletePokemon;