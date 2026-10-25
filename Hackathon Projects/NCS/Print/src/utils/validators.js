const validateCloudinaryUrl = (url) => {
  try {
    const cloudinaryUrlPattern = /^https?:\/\/(?:res\.)?cloudinary\.com\/([^\/]+)\/(?:image|video|raw)\/upload\//i;
    return cloudinaryUrlPattern.test(url);
  } catch (error) {
    return false;
  }
};

module.exports = { validateCloudinaryUrl };
