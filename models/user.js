const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const Scheme = mongoose.Schema;

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        default: '',
    
    },
    lastname: {
        type: String,
        default: '',
    
    },
    admin: {
        type: Boolean,
        default: false
    }

});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);