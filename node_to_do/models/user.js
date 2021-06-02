const {model , Schema} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    token: {
        type: String,
    },
    timeToLive: {
        type: Number,
    }
});


module.exports = model('User', userSchema);
