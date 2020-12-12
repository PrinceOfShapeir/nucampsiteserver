const mongoose = require('mongoose');
const favoriteRouter = require('../routes/partnerRouter');
const Schema = mongoose.Schema;

favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    campsites: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Campsite'
    }
});
const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;