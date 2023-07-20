const express = require('express');
const router = express.Router();
const { createUser, getUsers, verifyUser, unverifyUser, getVerifiedUsers, getUserById, otpVerify, loginUser, updateUser, deleteUser } = require('./controllers/userController');
const upload = require('./middlewares/multer');

router.post('/register', upload.array('photos', 10), createUser);

router.get('/users', getUsers);

router.patch('/verify/:id', verifyUser);

router.patch('/unverify/:id', unverifyUser);

router.get('/verified-users', getVerifiedUsers);

router.get('/user/:id', getUserById);

router.post('/verify/user/:id', otpVerify);

router.post('/login', loginUser);

router.patch('/update/user/:id', updateUser);

router.delete('/user/:id', deleteUser);

module.exports = router;
