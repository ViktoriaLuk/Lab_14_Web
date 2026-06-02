const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({

    number: {
        type: Number,
        required: [true, 'Room number is required'],
        unique: true
    },

    type: {
        type: String,
        required: [true, 'Room type is required'],
        enum: ['single', 'double', 'lux']
    },

    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },

    capacity: {
        type: Number,
        required: [true, 'Capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },

    available: {
        type: Boolean,
        default: true
    }

});

module.exports = mongoose.model('Room', roomSchema);