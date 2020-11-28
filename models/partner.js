const mongoose = require('mongoose');
const partnerRouter = require('../routes/partnerRouter');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    name: {
        required: true,
        type: String,
        unique: true
        },
    image: {
        required: true,
        type: String
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Partner = mongoose.model('Partner', partnerSchema);
module.exports = Partner;