const express = require('express');
const router = express.Router();

const usuarios = require('../models/modeloUsuarios');
const passport = require('passport');


router.get('/users/signin', (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/instrumentos',
    failureRedirect: '/users/signin',
    failureFlash: true
}));

router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirm_password} = req.body;
    const errors = [];
    if(name.length <= 0){
        errors.push({text: 'Por favor inserta tu nombre'})
    }if(email.length <= 0){
        errors.push({text: 'Por favor inserta tu correo'})
    }
    if(password.length <= 0){
        errors.push({text: 'Por favor inserta una contraseña'})
    }
    if(confirm_password.length <= 0){
        errors.push({text: 'Por favor inserta la confirmacion de contraseña'})
    }
    if(password != confirm_password){
        errors.push({text: 'Las contraseñas no coinciden'})
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password});
    }else {
        const emailUser = await usuarios.findOne({email: email});
        if(emailUser){
            req.flash('error_msg', 'El correo ya existe');
            res.redirect('/users/signup');
        }
        const nuevoUsuario = new usuarios({name, email, password, confirm_password});
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password); //encripta la contraseña
        await nuevoUsuario.save();
        req.flash('exito_msg', 'Registrado correctamente');
        res.redirect('/users/signin');
    }
});

router.get('/users/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/instrumentosLogout');
    });
  });

module.exports = router;