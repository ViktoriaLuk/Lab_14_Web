// routes/bookingRoutes.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // Дозволяє бачити :roomId з батьківського роутера

const bookingController = require('../controllers/bookingController');
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { createBookingSchema } = require('../validators/bookingValidators');

router.get('/', bookingController.getRoomBookings); // Публічний перегляд бронювань кімнати
router.post('/', protect, validate(createBookingSchema), bookingController.createBooking); // Тільки авторизовані
router.delete('/:id', protect, bookingController.deleteBooking); // Автор або адмін

module.exports = router;