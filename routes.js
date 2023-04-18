const express = require('express');
const router = express.Router();
const { createUser, getUsers } = require('./controllers/userController');
const upload = require('./middlewares/multer');

router.post('/register', upload.array('photos', 10), createUser);

router.get('/users', getUsers);
module.exports = router;
