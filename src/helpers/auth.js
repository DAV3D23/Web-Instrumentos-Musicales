const helpers = {};
helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Inicie sesion primero');
    res.redirect('/users/signin');
};

module.exports = helpers;