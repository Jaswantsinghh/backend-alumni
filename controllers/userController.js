const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const photos = [];

    // handle multiple photo uploads
    if (req.photos) {
      req.photos.forEach(file => {
        photos.push(file.filename);
      });
    }

    console.log(photos);

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