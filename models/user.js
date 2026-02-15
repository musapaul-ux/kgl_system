const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String,
         required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: {
        type: String,
        enum: ['Manager', 'SalesAgent'],
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);
