const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let roleSchema = new Schema({
    description: {
        type: String,
        required: [true, 'Debe completar el nombre'],
    },
    status: {
        type: Boolean,
        default: true
    },
    group: {
        type: Schema.ObjectId,
        ref:"Group",
        required: [true, 'Debe ingresar un grupo']
    }
});

roleSchema.plugin( uniqueValidator, {message: '{VALUE} ya existe'});

module.exports = mongoose.model('Role', roleSchema);