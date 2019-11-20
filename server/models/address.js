const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let addressSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Debe completar el nombre de la calle']
    },
    user: {
        type: Schema.ObjectId,
        ref: "User",
        required: [true, 'Debe completar el usuario']
    }
});

module.exports = mongoose.model('Address', addressSchema);