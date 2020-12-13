const mongoose = require('mongoose');
const favoriteRouter = require('../routes/partnerRouter');
const Schema = mongoose.Schema;

favoriteSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    campsites: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'Campsite'
    }]
});
const Favorite = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorite;