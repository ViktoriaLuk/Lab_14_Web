// services/bookingService.js
const Booking = require('../models/Booking');

exports.getBookingsByRoom = async (roomId) => {
  return await Booking.find({ room: roomId }).populate('user', 'name email');
};

exports.createBooking = async (data, roomId, userId) => {
  return await Booking.create({
    ...data,
    room: roomId,
    user: userId
  });
};

exports.deleteBooking = async (bookingId, currentUser) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Бронювання не знайдено');
  }

  // Видалити може або автор бронювання, або адмін
  if (booking.user.toString() !== currentUser._id.toString() && currentUser.role !== 'admin') {
    throw new Error('Ви не маєте прав для видалення цього бронювання');
  }

  await booking.deleteOne();
  return booking;
};