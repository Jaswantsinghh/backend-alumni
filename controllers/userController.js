const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const User = require('../models/User');

const emailTemplate = (otp) => {
    return `
    <div style="background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #fff; padding: 20px; border-radius: 5px;">
            <h1 style="text-align: center; color: #3f51b5;">Alumni Portal</h1>
            <p style="text-align: center; color: #3f51b5;">Verify your account</p>
            <p style="text-align: center; color: #3f51b5;">Your OTP is: ${otp}</p>
        </div>
    </div>
    `;
}

const sendEmail = (email, otp) => {
    const msg = {
        to: email,
        from: 'jaswant1915040@gndec.ac.in',
        subject: 'Verify your account',
        text: 'Verify your account',
        html: emailTemplate(otp),
    };
    return msg;
}
  

exports.createUser = async (req, res) => {
  try {
    const photos = [];
    let profilePhoto;
    // handle multiple photo uploads
    if (req?.files?.photos) {
        // profilePhoto = req.files.profilePhoto;
      req?.files?.photos.forEach(file => {
        photos.push(file.key);
      });
    }

    if (req?.files?.profilePhoto) {
        profilePhoto = req.files.profilePhoto[0].key;
    }

    const existingUser = await User.find({ email: req.body.email });

    if (req?.body?.email && existingUser.length > 0) {
        return res.status(409).json({ message: "Email already exists!"});
    }

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        rollNo: req.body.rollNo,
        branch: req.body.branch,
        graduationYear: req.body.gradYear,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        country: req.body.country,
        pincode: req.body.pincode,
        email: req.body.email,
        photos: photos,
        profilePhoto: profilePhoto,
        twitterProfileUrl: req.body.twitterProfile,
        instagramProfileUrl: req.body.instagramProfile,
        facebookProfileUrl: req.body.facebookProfile,
        about: req.body.aboutMe,
        password: req.body.password,
    });

    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
    newUser.otp = otp;
    /* console.log(otp);
    console.log(newUser.email);
    const msg = sendEmail(newUser.email, otp);
    sgMail.send(msg)
    .then(() => {
        console.log('Email sent');
    })
    .catch((error) => {
        console.log(error.response.body);
        res.status(500).json({ message: 'Error creating user' });
        return;
    }); */
    await newUser.save();

    const user = await User.find({ email: newUser.email });
    res.status(200).json({ message: 'User created successfully', user: user[0] });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating user', error: error });
  }
};

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

exports.verifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error verifying user' });
    }
}

exports.unverifyUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.isVerified = false;
        await user.save();
        res.status(200).json({ message: 'User unverified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unverifying user' });
    }
}

exports.getVerifiedUsers = async (req, res) => {
    try {
        const users = await User.find({ isVerified: true });
        console.log(users);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
}

exports.otpVerify = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        console.log(user.otp);
        console.log(req.otp);
        console.log(req.body.otp);
        if (user.otp == req.body.otp) {
            user.accountVerified = true;
            await user.save();
            res.status(200).json({ message: 'Account verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying account' });
    }
}

exports.updateUser = async (req, res) => {
    const photos = [];

    // handle multiple photo uploads
    console.log(req.files);
    if (req.files) {
      req.files.forEach(file => {
        photos.push(file.key);
      });
    }
    try {
        const user = await User.findById(req.params.id);
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.rollNo = req.body.rollNo;
        user.branch = req.body.branch;
        user.graduationYear = req.body.gradYear;
        user.phoneNumber = req.body.phoneNumber;
        user.address = req.body.address;
        user.country = req.body.country;
        user.pincode = req.body.pincode;
        user.email = req.body.email;
        user.twitterProfileUrl = req.body.twitterProfile;
        user.instagramProfileUrl = req.body.instagramProfile;
        user.facebookProfileUrl = req.body.facebookProfile;
        user.about = req.body.aboutMe;
        user.photos = photos;
        user.updationReq = true,
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await User.find({ email: req.body.email });
        console.log(user);
        if (user.length < 1) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = jwt.sign({ id: user[0]?._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        if (user.length > 0) {
            if (user[0].password == req.body.password) {
                res.status(200).json({ token: token, user: user[0] });
            } else {
                res.status(400).json({ message: 'Invalid password' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in user', error: error });
        console.log(error);
    }
}

exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.id)
    .then(() => {
        res.status(200).json({ message: 'User deleted successfully' });
    })
    .catch((err) => {
        res.status(500).json({ message: 'Error deleting user', error: err });
    })
}

exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out user' });
    }
}