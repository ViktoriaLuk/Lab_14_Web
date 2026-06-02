require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');

const app = express();

app.use(express.json());
app.use(express.static('public')); // Підключення статики

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });