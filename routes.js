const express = require('express');
const router = express.Router();
const { createUser, getUsers, verifyUser, unverifyUser, getVerifiedUsers, getUserById } = require('./controllers/userController');
const upload = require('./middlewares/multer');

router.post('/register', upload.array('photos', 10), createUser);

router.get('/users', getUsers);

router.patch('/verify/:id', verifyUser);

router.patch('/unverify/:id', unverifyUser);

router.get('/verified-users', getVerifiedUsers);

router.get('/user/:id', getUserById);

module.exports = router;
