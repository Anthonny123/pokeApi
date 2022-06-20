const chai = require('chai');
const chaiHttp = require('chai-http');
const usersController = require('../auth/users');
const teamsController = require('../teams/teams-controller');


chai.use(chaiHttp);

const app = require('../index').app;

beforeEach(async () =>{
    await usersController.registerUser('anthonny', '1234');
    await usersController.registerUser('anthonny321', '4321');
});

afterEach(async () =>{
    await usersController.cleanUser();
    await teamsController.cleanTeam();
});

describe('Auth Test for Teams', ()=>{
    it('Devolver el equipo De un usuario', (done) =>{
        let team = [{name: 'Charizard'}, {name: 'Pikachu'}];
        chai.request(app)
        .post('/auth/login')
        .set('content-type', 'application/json')
        .send({user: 'anthonny', password:'1234'})
        .end((err, res) =>{
            let token = res.body.token;
            console.log(`Este es el body: ${res.body}`)
            chai.request(app)
            .put('/team')
            .send({
                team: team
            })
            .set('Authorization', `JWT ${token}`)
            .end((err, res)=>{
                chai.request(app)
                .get('/team')
                .set('Authorization', `JWT ${token}`)
                .end((err, res)=>{
                    //Equipo pokemon
                    //{trainer: 'anthonny', teams:[pokemon]}
                    chai.assert.equal(res.body.trainer, 'anthonny');
                    chai.assert.equal(res.body.team.length, 2);
                    chai.assert.equal(res.body.team[0].name, team[0].name);
                    chai.assert.equal(res.body.team[1].name, team[1].name);
                    chai.assert.equal(res.statusCode, 200);
                    done()
                });
            });
        });
    });
    it('Agregar un pokemon nuevo y devolver el nro de pokedex', (done) =>{
        let pokemonName = 'Bulbasaur';
        chai.request(app)
        .post('/auth/login')
        .set('content-type', 'application/json')
        .send({user: 'anthonny', password:'1234'})
        .end((err, res) =>{
            let token = res.body.token;
            chai.request(app)
            .post('/team/pokemons')
            .send({name:pokemonName})
            .set('Authorization', `JWT ${token}`)
            .end((err, res)=>{
                chai.request(app)
                .get('/team')
                .set('Authorization', `JWT ${token}`)
                .end((err, res)=>{
                    //Equipo pokemon
                    //{trainer: 'anthonny', teams:[pokemon]}
                    chai.assert.equal(res.body.trainer, 'anthonny');
                    chai.assert.equal(res.body.team.length, 1);
                    chai.assert.equal(res.body.team[0].name, pokemonName);
                    chai.assert.equal(res.body.team[0].pokedexNumber, 1);
                    chai.assert.equal(res.statusCode, 200);
                    done();
                });
            });
        });
    });
    it('eliminar un pokemon del team', (done) =>{
        let team = [{name: 'Charizard'}, {name: 'Pikachu'}];
        chai.request(app)
        .post('/auth/login')
        .set('content-type', 'application/json')
        .send({user: 'anthonny', password:'1234'})
        .end((err, res) =>{
            let token = res.body.token;
            chai.request(app)
            .put('/team')
            .send({
                team: team
            })
            .set('Authorization', `JWT ${token}`)
            .end((err, res)=>{
                chai.request(app)
                .delete('/team/pokemons/1')
                .set('Authorization', `JWT ${token}`)
                .end((err, res)=>{
                    chai.request(app)
                    .get('/team')
                    .set('Authorization', `JWT ${token}`)
                    .end((err, res) =>{
                        chai.assert.equal(res.statusCode, 200);
                        chai.assert.equal(res.body.trainer, 'anthonny');
                        chai.assert.equal(res.body.team.length, team.length - 1);
                        done();
                    });
                });
            });
        });
    });
    it('No deberia poder agregar un pokemon, equipo full', (done) =>{
        let team = [
            {name: 'Charizard'}, 
            {name: 'Pikachu'},
            {name: 'Blastoise'}, 
            {name: 'Pikachu'},
            {name: 'Charizard'}, 
            {name: 'Blastoise'}];
        chai.request(app)
        .post('/auth/login')
        .set('content-type', 'application/json')
        .send({user: 'anthonny', password:'1234'})
        .end((err, res) =>{
            let token = res.body.token;
            chai.request(app)
            .put('/team')
            .send({team: team})
            .set('Authorization', `JWT ${token}`)
            .end((err, res)=>{
                chai.request(app)
                .post('/team/pokemons')
                .send({name:'Vibrava'})
                .set('Authorization', `JWT ${token}`)
                .end((err, res)=>{
                    console.log(`El codigo que devuelve en el test es: ${res.statusCode}`);
                    chai.assert.equal(res.statusCode, 400);
                    done();
                });
            });
        });
    });
});

after((done) =>{
    usersController.cleanUser();
    done();
})