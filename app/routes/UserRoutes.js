const verifyToken = require('../../middleware/verifytoken');

module.exports = app => {
    const user = require('../controllers/UserController');
    const router = require('express').Router();

    router.post('/register', user.register);
    router.post('/auth', user.login);
    router.get('/', verifyToken, user.getAllUsers);


    app.use('/api/user', router);
}