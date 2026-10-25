const axios = require('axios');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const fetchFileFromCloudinary = async (url) => {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch file from Cloudinary: ${error.message}`);
  }
};

module.exports = { fetchFileFromCloudinary };
