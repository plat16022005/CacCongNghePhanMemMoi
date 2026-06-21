const cloudinary = require('cloudinary').v2;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

cloudinary.uploader.upload('https://cloudinary-res.cloudinary.com/image/upload/cloudinary_logo.png', { folder: 'rooms' })
  .then(res => console.log('Upload success:', res.public_id))
  .catch(err => console.error('Upload failed:', err));
