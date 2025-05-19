// models/Plan.js
const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    planId: {
        type: String,
        required: true,
        unique: true
    },
    planName: {
        type: String,
        required: true
    },
    details: {
        type: String
    }
});

module.exports = mongoose.model('Plan', planSchema);