const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const passport = require('passport');

const usuariosSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    confirm_password: {type: String, required: true}
});
//cifrar la contraseña
usuariosSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

usuariosSchema.methods.matchPassword = async function (password){
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Usuario', usuariosSchema)