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
        from: 'jaswantsinghjsn@gmail.com',
        subject: 'Verify your account',
        text: 'Verify your account',
        html: emailTemplate(otp),
    };
    return msg;
}
  

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const photos = [];

    // handle multiple photo uploads
    if (req.files) {
      req.files.forEach(file => {
        photos.push(file.filename);
      });
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
        twitterProfileUrl: req.body.twitterProfile,
        instagramProfileUrl: req.body.instagramProfile,
        facebookProfileUrl: req.body.facebookProfile,
        about: req.body.aboutMe,
        password: req.body.password,
    });

    const otp = Math.floor(100000 + Math.random() * 900000);
    newUser.otp = otp;
    console.log(otp);
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
    });

    await newUser.save();
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating user' });
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
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await User.find({ email: req.body.email });
        const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        if (user.length > 0) {
            if (user[0].password == req.body.password) {
                res.status(200).json({ token: token, user: user[0] });
            } else {
                res.status(400).json({ message: 'Invalid password' });
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in user' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
}

exports.logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out user' });
    }
}