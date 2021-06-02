const {model , Schema} = require('mongoose');

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    login: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    timeToLive: {
        type: Number,
    }
});

module.exports = model('Admin', adminSchema);
