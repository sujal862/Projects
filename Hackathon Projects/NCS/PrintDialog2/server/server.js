const express = require('express');
const cors = require('cors');
const printer = require('node-printer');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Utility function to validate Cloudinary URL
const isValidCloudinaryUrl = (url) => {
    try {
        const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/.+/;
        return cloudinaryPattern.test(url);
    } catch (error) {
        return false;
    }
};

// Get all USB printers
app.get('/api/printers', (req, res) => {
    try {
        // Get list of all installed printers
        const printers = printer.getPrinters();
        // Filter USB printers
        const usbPrinters = printers.filter(p => p.connection === 'USB');
        
        res.json({
            status: 'success',
            printers: usbPrinters.map(p => ({
                name: p.name,
                status: p.status || 'Ready',
                isDefault: p.isDefault || false,
                supportedFormats: p.supportedFormats || ['PDF', 'JPEG', 'PNG']
            }))
        });
    } catch (error) {
        console.error('Error fetching printers:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch printers'
        });
    }
});

// Get specific printer status
app.get('/api/printer-status/:printerName', (req, res) => {
    try {
        const { printerName } = req.params;
        const printerInfo = printer.getPrinter(printerName);
        
        if (!printerInfo) {
            return res.status(404).json({
                status: 'error',
                message: 'Printer not found'
            });
        }

        res.json({
            status: 'success',
            printer: {
                name: printerInfo.name,
                status: printerInfo.status || 'Ready',
                queue: printerInfo.jobs ? printerInfo.jobs.length : 0
            }
        });
    } catch (error) {
        console.error('Error fetching printer status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch printer status'
        });
    }
});

// Submit print job
app.post('/api/print', async (req, res) => {
    try {
        const {
            printerName,
            cloudinaryUrl,
            copies = 1,
            paperSize = 'A4',
            orientation = 'portrait',
            colorMode = 'color'
        } = req.body;

        // Validate inputs
        if (!printerName || !cloudinaryUrl) {
            return res.status(400).json({
                status: 'error',
                message: 'Printer name and file URL are required'
            });
        }

        // Validate Cloudinary URL
        if (!isValidCloudinaryUrl(cloudinaryUrl)) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid Cloudinary URL'
            });
        }

        // Get printer instance
        const selectedPrinter = printer.getPrinter(printerName);
        if (!selectedPrinter) {
            return res.status(404).json({
                status: 'error',
                message: 'Printer not found'
            });
        }

        // Download file from Cloudinary
        const response = await axios.get(cloudinaryUrl, {
            responseType: 'arraybuffer'
        });

        // Create print job
        const printJob = selectedPrinter.printBuffer(response.data, {
            copies,
            paperSize,
            orientation,
            color: colorMode === 'color'
        });

        res.json({
            status: 'success',
            message: 'Print job submitted successfully',
            jobId: printJob.id
        });
    } catch (error) {
        console.error('Error submitting print job:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to submit print job'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
