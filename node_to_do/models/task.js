const {Schema, model} = require('mongoose');

const taskSchema = new Schema({
    name: {
        type: String, 
        required: true
    },    
    type: {
        type: String,
        required: true
    },
    checked: {
        type: Boolean,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});


module.exports = model('Task', taskSchema);
