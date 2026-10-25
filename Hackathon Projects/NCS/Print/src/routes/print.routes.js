const express = require('express');
const printer = require('node-printer');
const { printController } = require('../controllers/print.controller');
const { validatePrintRequest } = require('../middleware/validators');

const router = express.Router();

// Get all available printers
router.get('/printers', (req, res) => {
  try {
    const printers = printer.getPrinters();
    res.json({
      success: true,
      data: printers.map(p => ({
        name: p.name,
        isDefault: p.isDefault,
        status: p.status
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get printers',
      error: error.message
    });
  }
});

// Print endpoint
router.post('/print', validatePrintRequest, printController);

module.exports = { printRouter: router };
