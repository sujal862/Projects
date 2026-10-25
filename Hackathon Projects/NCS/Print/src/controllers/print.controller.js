const printer = require('node-printer');
const axios = require('axios');
const { validateCloudinaryUrl } = require('../utils/validators');
const { fetchFileFromCloudinary } = require('../utils/cloudinary');

const printController = async (req, res) => {
  try {
    const {
      fileUrl,
      printerName,
      settings = {}
    } = req.body;

    // Validate Cloudinary URL
    if (!validateCloudinaryUrl(fileUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Cloudinary URL'
      });
    }

    // Get printer instance
    let printerInstance;
    if (printerName) {
      printerInstance = printer.getPrinter(printerName);
      if (!printerInstance) {
        return res.status(404).json({
          success: false,
          message: `Printer "${printerName}" not found`
        });
      }
    } else {
      // Get default printer
      printerInstance = printer.getDefaultPrinter();
      if (!printerInstance) {
        return res.status(404).json({
          success: false,
          message: 'No default printer found'
        });
      }
    }

    // Fetch file from Cloudinary
    const fileBuffer = await fetchFileFromCloudinary(fileUrl);

    // Prepare print options
    const printOptions = {
      media: settings.paperSize || 'A4',
      orientation: settings.orientation || 'portrait',
      copies: settings.copies || 1,
      ...settings
    };

    // Send to printer
    const jobId = await new Promise((resolve, reject) => {
      printerInstance.printBuffer(fileBuffer, printOptions, (err, jobId) => {
        if (err) reject(err);
        else resolve(jobId);
      });
    });

    res.json({
      success: true,
      message: 'Print job sent successfully',
      data: {
        jobId,
        printer: printerInstance.name
      }
    });

  } catch (error) {
    console.error('Print error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process print job',
      error: error.message
    });
  }
};

module.exports = { printController };
