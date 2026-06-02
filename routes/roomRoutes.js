const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ success: true, data: rooms });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Доступ заборонено, токен відсутній' });
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);

        const newRoom = await Room.create(req.body);
        res.status(201).json({ success: true, data: newRoom });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Невалідний або прострочений токен' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Доступ заборонено, токен відсутній' });
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);

        const deletedRoom = await Room.findByIdAndDelete(req.params.id);
        
        if (!deletedRoom) {
            return res.status(404).json({ success: false, message: 'Кімнату не знайдено' });
        }

        res.status(200).json({ success: true, message: 'Кімнату успішно видалено' });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Невалідний або прострочений токен' });
    }
});

module.exports = router;