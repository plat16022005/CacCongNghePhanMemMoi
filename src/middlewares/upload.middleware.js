const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage cho ảnh phòng
const roomStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'rooms',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

// Storage cho ảnh CCCD
const cccdStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'cccd',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }],
      public_id: `${file.fieldname}_${req.user?.id}_${Date.now()}`
    };
  }
});

const upload = multer({ storage: roomStorage });
const uploadCccd = multer({ storage: cccdStorage });

module.exports = upload;
module.exports.uploadCccd = uploadCccd;