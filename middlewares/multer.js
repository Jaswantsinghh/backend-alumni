const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');
const { dialogContentClasses } = require('@mui/material');

dotenv.config();

let space = new AWS.S3({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  useAccelerateEndpoint: false,
  credentials: new AWS.Credentials(process.env.DO_SPACES_KEY, process.env.DO_SPACES_SECRET, null)
});

const bucketName = process.env.DO_SPACES_NAME;

// AWS.config.update({
//   accessKeyId: 'YOUR_ACCESS_KEY',
//   secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
//   endpoint: 'https://YOUR_ENDPOINT.digitaloceanspaces.com', // Replace YOUR_ENDPOINT with your DigitalOcean Spaces endpoint
// });

// const s3 = new AWS.S3();

const storage = multerS3({
  s3: space,
  bucket: bucketName, // Replace YOUR_BUCKET_NAME with your DigitalOcean Spaces bucket name
  acl: 'public-read',
  key: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB
  }
});

module.exports = upload;
