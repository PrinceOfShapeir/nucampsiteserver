const mongoose = require('mongoose');
const partnerRouter = require('../routes/partnerRouter');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema({
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
    cost: {
        type: Currency,
        required: true,
        min: 0
    },

    description: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Promotion = mongoose.model('Promotion', promotionSchema);
module.exports = Promotion;

module.exports = Promotion;