const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Address = require('../models/address')

let Schema = mongoose.Schema;

let rolesValid ={
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Debe completar el nombre']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Debe completar el email']
    },
    password: {
        type: String,
        required: [true, 'Debe completar la contra']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: Schema.ObjectId,
        ref: "Role",
        required: [true, 'Debe ingresar un rol']
    },
    addresses: [{
        
    }],
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
    
});

userSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin( uniqueValidator, {message: '{VALUE} ya existe'});

module.exports = mongoose.model('User', userSchema);