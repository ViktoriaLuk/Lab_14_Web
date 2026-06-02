require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const protect = require('./middleware/protect');

const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    credentials: true                
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public')); 

app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

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