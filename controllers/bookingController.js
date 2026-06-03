const bookingService = require('../services/bookingService');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

exports.getRoomBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getBookingsByRoom(req.params.roomId);
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { checkIn, checkOut, guests } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Кімнату не знайдено' });
    }

    // ОБОВ'ЯЗКОВО перетворюємо рядки з Postman на об'єкти дат перед перевіркою
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    const existingBooking = await Booking.findOne({
      room: roomId,
      $or: [
        {
          checkIn: { $lt: endDate },
          checkOut: { $gt: startDate }
        }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Ви вже забронювали цю кімнату на цей час'
      });
    }

    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = days * room.price;

    // Створюємо бронювання, передаючи вже правильні об'єкти дат (startDate та endDate)
    const booking = await Booking.create({
      room: roomId,
      user: req.user._id || req.user.id,
      checkIn: startDate,
      checkOut: endDate,
      guests,
      totalPrice
    });

    res.status(201).json({
      success: true,
      data: booking
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    await bookingService.deleteBooking(req.params.id, req.user);
    res.status(200).json({ success: true, message: 'Бронювання успішно скасовано' });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
};