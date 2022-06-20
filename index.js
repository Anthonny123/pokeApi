const express = require("express");
const middleware = require('./middleware')
require('./database');

const app = express();
const PORT =  3000;

middleware.setupMiddlewares(app); // Configuracion de middlewares

//Routes
const authRoutes = require('./auth/auth-route').router;
const teamRoutes = require('./teams/teams-route').router;
app.use('/auth', authRoutes); // En el el apartado /auth se usara la config de authRoutes
app.use('/team', teamRoutes); // En el el apartado /team se usara la config de teamRoutes

//Server
app.listen(PORT, () => console.log("Server listen on port", PORT));

exports.app = app;