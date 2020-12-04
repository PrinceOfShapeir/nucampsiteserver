const mongoose = require('mongoose');
const Scheme = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unqiue: true,
    },
    password: {
    type: String,
    require: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('User', userSchema);