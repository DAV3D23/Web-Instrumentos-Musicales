const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const usuarios = require('../models/modeloUsuarios');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    const emailUser = await usuarios.findOne({email: email});
    if(!emailUser){
        return done(null, false, { message: 'Usuario no encontrado'});
    }else{
        const match = await emailUser.matchPassword(password);
        if(match){
            return done(null, emailUser);
        }else{
            return done(null, false, { message: 'Contraseña incorrecta'});
        }
    }
}));

passport.serializeUser((emailUser, done) => {
    done(null, emailUser.id)
});

passport.deserializeUser((id, done) => {
    usuarios.findOne({_id : id})
      .then(emailUser => done(null, emailUser))
      .catch(err => done(err));
  });