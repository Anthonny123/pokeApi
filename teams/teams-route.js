const express = require('express');
const router = express.Router();

const teamsHttpHandlers = require('./teams-http');


router.route('/')
    .get(teamsHttpHandlers.getTeamFromUser)
    .put(teamsHttpHandlers.setTeamToUser)

router.route('/pokemons')
    .post(teamsHttpHandlers.addPokemonsHandler);

router.route('/pokemons/:pokeid')//Los dos puntos es para denotar que eso sera un paramatro
    .delete(teamsHttpHandlers.deletePokemon);

exports.router = router;