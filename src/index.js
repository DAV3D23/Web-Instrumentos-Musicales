const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const passport = require('passport');
const localpassport = require('passport-local');

//Inicializaciones
const app = express();
require('./database');
require('./config/passport');

//Configuracion
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'Partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

//Ejecucion antes de servidor 
app.use(express.urlencoded({extended: false}));//IMAGENES
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp', 
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables globales 

app.use((req, res, next) => {
    res.locals.exito_msg = req.flash('exito_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    let user = null
    if(req.user){
        user =JSON.parse(JSON.stringify(req.user))
    } 
    res.locals.user = user
    next();
})


//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/instrumentos'));
app.use(require('./routes/users'));

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//Servidor escuchando
app.listen(app.get('port'), () => {
    console.log('Servidor en el puerto ', app.get('port'));
}); 

