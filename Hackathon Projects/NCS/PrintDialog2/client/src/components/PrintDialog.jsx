import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    TextField,
    RadioGroup,
    FormControlLabel,
    Radio,
    CircularProgress,
    Snackbar,
} from '@mui/material';

const PrintDialog = ({ open, onClose, cloudinaryUrl }) => {
    // State management
    const [printers, setPrinters] = useState([]);
    const [selectedPrinter, setSelectedPrinter] = useState('');
    const [copies, setCopies] = useState(1);
    const [paperSize, setPaperSize] = useState('A4');
    const [orientation, setOrientation] = useState('portrait');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch printers on component mount
    useEffect(() => {
        fetchPrinters();
    }, []);

    // Fetch available printers
    const fetchPrinters = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/printers');
            setPrinters(response.data.printers);
            if (response.data.printers.length > 0) {
                setSelectedPrinter(response.data.printers[0].name);
            }
        } catch (error) {
            setError('Failed to fetch printers');
            console.error('Error fetching printers:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle print submission
    const handlePrint = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/print', {
                printerName: selectedPrinter,
                cloudinaryUrl,
                copies,
                paperSize,
                orientation,
            });
            setSuccess('Print job submitted successfully');
            onClose();
        } catch (error) {
            setError('Failed to submit print job');
            console.error('Error submitting print job:', error);
        } finally {
            setLoading(false);
        }
    };

    // File preview component
    const FilePreview = () => {
        const isImage = cloudinaryUrl?.match(/\.(jpg|jpeg|png|gif)$/i);
        const isPDF = cloudinaryUrl?.match(/\.pdf$/i);

        return (
            <div className="relative w-full h-64 border rounded-lg overflow-hidden">
                {isImage && (
                    <img
                        src={cloudinaryUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        style={{ pointerEvents: 'none' }}
                    />
                )}
                {isPDF && (
                    <iframe
                        src={cloudinaryUrl}
                        title="PDF Preview"
                        className="w-full h-full"
                        style={{ pointerEvents: 'none' }}
                    />
                )}
                <div 
                    className="absolute inset-0" 
                    style={{ pointerEvents: 'none' }}
                    onContextMenu={(e) => e.preventDefault()}
                />
            </div>
        );
    };

    return (
        <>
            <Dialog 
                open={open} 
                onClose={onClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Print Document</DialogTitle>
                <DialogContent>
                    {loading && (
                        <div className="flex justify-center my-4">
                            <CircularProgress />
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Printer Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Select Printer
                            </label>
                            <Select
                                value={selectedPrinter}
                                onChange={(e) => setSelectedPrinter(e.target.value)}
                                fullWidth
                            >
                                {printers.map((printer) => (
                                    <MenuItem key={printer.name} value={printer.name}>
                                        {printer.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        {/* Copies */}
                        <div>
                            <TextField
                                type="number"
                                label="Number of Copies"
                                value={copies}
                                onChange={(e) => setCopies(Math.max(1, parseInt(e.target.value)))}
                                fullWidth
                                InputProps={{ inputProps: { min: 1 } }}
                            />
                        </div>

                        {/* Paper Size */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Paper Size
                            </label>
                            <Select
                                value={paperSize}
                                onChange={(e) => setPaperSize(e.target.value)}
                                fullWidth
                            >
                                <MenuItem value="A4">A4</MenuItem>
                                <MenuItem value="Letter">Letter</MenuItem>
                                <MenuItem value="Legal">Legal</MenuItem>
                            </Select>
                        </div>

                        {/* Orientation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Orientation
                            </label>
                            <RadioGroup
                                value={orientation}
                                onChange={(e) => setOrientation(e.target.value)}
                                row
                            >
                                <FormControlLabel
                                    value="portrait"
                                    control={<Radio />}
                                    label="Portrait"
                                />
                                <FormControlLabel
                                    value="landscape"
                                    control={<Radio />}
                                    label="Landscape"
                                />
                            </RadioGroup>
                        </div>

                        {/* File Preview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Preview
                            </label>
                            <FilePreview />
                        </div>
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePrint}
                        color="primary"
                        variant="contained"
                        disabled={loading || !selectedPrinter}
                    >
                        {loading ? 'Printing...' : 'Print'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Error/Success Messages */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                message={error}
            />
            <Snackbar
                open={!!success}
                autoHideDuration={6000}
                onClose={() => setSuccess('')}
                message={success}
            />
        </>
    );
};

export default PrintDialog;
