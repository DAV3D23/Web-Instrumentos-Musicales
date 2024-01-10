const express = require('express');
const router = express.Router();

const baseDatos = require('../models/modelobd');

const {isAuthenticated} = require('../helpers/auth');

router.get('/instrumentos/agregar', isAuthenticated, (req, res) => {
    res.render('instrumentos/nuevoInstrumento');
});

router.post('/instrumentos/nuevoInstrumento', isAuthenticated, async (req, res) =>{
    const{title, description, precio, imagenUrl} = req.body;
    const errors = []
    if(!title){
        errors.push({text: 'Por favor escriba el nombre del instrumento'});
    }
    if(!description){
        errors.push({text: 'Por favor escriba la descrpcion del instrumento'});
    }
    if(!precio){
        errors.push({text: 'Por favor escriba el precio del instrumento'});
    }
    if(!imagenUrl){
        errors.push({text: 'Por favor escriba la URL de la imagen'});
    }
    if(errors.length > 0){
        res.render('instrumentos/nuevoInstrumento', {
            errors,
            title,
            description,
            precio,
            imagenUrl
        });
    } else {
        const insert = new baseDatos({ title, description, precio, imagenUrl });
        await insert.save();
        req.flash('exito_msg', 'Se agrego el instrumento correctamente!')
        res.redirect('/instrumentos')
    }
    
});

router.get('/instrumentos',isAuthenticated, async (req, res) => {
    const read = await baseDatos.find().lean();
    res.render('instrumentos/leerInstrumentos', { read });
});

router.get('/instrumentosLogout', async (req, res) => {
    const read = await baseDatos.find().lean();
    res.render('instrumentos/leerInstrumentos2', { read });
});

router.get('/instrumentos/editar/:id',isAuthenticated, async (req, res) => {
    const encontrarId = await baseDatos.findById(req.params.id).lean();
    res.render('instrumentos/editarInstrumentos', {encontrarId});
});
router.put('/instrumentos/editarInstrumentos/:id',isAuthenticated, async (req, res) => {
    const {title, description, precio, imagenUrl} = req.body;
await baseDatos.findByIdAndUpdate(req.params.id, {title, description, precio, imagenUrl});
    req.flash('exito_msg', 'Instrumento actualizado correctamente!')
    res.redirect('/instrumentos');
});

router.delete('/instrumentos/eliminar/:id',isAuthenticated, async (req, res) => {
    await baseDatos.findByIdAndDelete(req.params.id);
    req.flash('exito_msg', 'Instrumento eliminado correctamente!')
    res.redirect('/instrumentos');
});
module.exports = router;

//note es BD
//notes es read
// encontrarId es note de la edicion