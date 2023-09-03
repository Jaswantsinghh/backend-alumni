const express = require('express');
const router = express.Router();
const { createUser, getUsers, verifyUser, unverifyUser, getVerifiedUsers, getUserById, otpVerify, loginUser, updateUser, deleteUser } = require('./controllers/userController');
const { upload } = require('./middlewares/multer');

const uploadMultiple = upload.fields([{ name: 'photos', maxCount: 10 }, { name: 'profilePhoto', maxCount: 1 }]);

router.post('/register', uploadMultiple, createUser);

router.get('/users', getUsers);

router.patch('/verify/:id', verifyUser);

router.patch('/unverify/:id', unverifyUser);

router.get('/verified-users', getVerifiedUsers);

router.get('/user/:id', getUserById);

router.post('/verify/user/:id', otpVerify);

router.post('/login', loginUser);

router.patch('/update/user/:id', upload.array('photos', 10), updateUser);

router.delete('/user/:id', deleteUser);

module.exports = router;
