const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');

const init = () =>{
    const opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt"); //Estrategia usada para Auth de rutas
    opts.secretOrKey = 'secretPassword';

    passport.use(new JwtStrategy(opts, (decoded, done)=>{
        //console.log('decode jwt', decoded);
        return done(null, decoded);
    }));
}

const protectWithJwt = (req, res, next) =>{
    if(req.path == '/' || req.path == '/auth/login'){ //Rutas que no requieren de JWT
        return next();
    }
    return passport.authenticate('jwt', {session: false})(req, res, next);
}

exports.init = init;
exports.protectWithJwt = protectWithJwt;