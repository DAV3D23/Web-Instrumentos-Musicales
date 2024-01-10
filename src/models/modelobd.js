const mongoose = require('mongoose');
const { Schema } = mongoose;

const musicaSchema = new Schema({
    title: { type: String, require: true},
    description: { type: String, require: true},
    precio: { type: String, require: true},
    imagenUrl: {type: String, require: true}
});

module.exports = mongoose.model('Instrumento', musicaSchema);