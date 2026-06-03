const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: [true, 'Кількість гостей обов\'язкова'],
    min: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

bookingSchema.index({ room: 1, user: 1, checkIn: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);