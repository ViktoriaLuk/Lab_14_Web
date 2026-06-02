const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        // 1. Спочатку шукаємо токен у кукісах браузера
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } 
        // 2. Якщо в куках немає, шукаємо в заголовках Authorization (для Postman)
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Якщо токена взагалі немає — не пускаємо
        if (!token) {
            return res.status(401).json({ success: false, message: 'Доступ заборонено. Токен відсутній' });
        }

        // Розшифровуємо токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'твій_таємний_ключ_з_лаб13');

        // Шукаємо користувача в базі даних за ID з токена
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ success: false, message: 'Користувача, що володіє цим токеном, більше не існує' });
        }

        // Додаємо користувача до запиту, щоб інші маршрути (наприклад, додавання кімнати 706) знали, хто робить запит
        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Невірний токен або термін його дії вичерпано. Увійдіть знову' });
    }
};

module.exports = protect;