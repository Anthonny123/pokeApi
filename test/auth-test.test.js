const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const app = require('../index').app;

const usersController = require('../auth/users');
const teamsController = require('../teams/teams-controller');


beforeEach(async() =>{
    await usersController.registerUser('anthonny', '1234');
    await usersController.registerUser('anthonny321', '4321');
})

afterEach(async() =>{
    await usersController.cleanUser();
    await teamsController.cleanTeam();
});

describe('Auth Test for Routes', ()=>{
    it('Return 401 when no jwt available', (done) =>{
        chai.request(app)
            .get('/team')
            .end((err, res) => {
                chai.assert.equal(res.statusCode, 401);
                done();
            });
    });
//Nota, el JWT debe enviarse en un header, y para enviar informacion en un header podemos usar la funcion set()
//Login Test
    it('Return 200 when Jwt is valid', (done) =>{
        chai.request(app)
        .post('/auth/login')
        .set('content-type', 'application/json')
        .send({user: 'anthonny', password:'1234'})
        .end((err, res) => {
            chai.assert.equal(res.statusCode, 200)
            done();
        });
    });
//Team Test
    
});

