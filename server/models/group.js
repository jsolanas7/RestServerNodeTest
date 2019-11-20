const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let groupSchema = new Schema({
    description: {
        type: String,
        required: [true, 'Debe completar el nombre'],
    },
    status: {
        type: Boolean,
        default: true
    },
});

groupSchema.plugin( uniqueValidator, {message: '{VALUE} ya existe'});

module.exports = mongoose.model('Group', groupSchema);