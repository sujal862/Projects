# Custom Print Dialog System

A comprehensive print dialog system for the Kawach web app that handles printing files from Cloudinary URLs to USB-connected printers.

## Features

- Custom print dialog with modern UI using Material-UI and TailwindCSS
- USB printer detection and management
- File preview for images and PDFs
- Print job customization (copies, paper size, orientation)
- Secure file handling with Cloudinary integration
- Real-time printer status updates

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- USB-connected printer(s)

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   npm run dev
   ```
2. In a new terminal, start the frontend development server:
   ```bash
   cd client
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/printers` - Get list of available USB printers
- `GET /api/printer-status/:printerName` - Get status of specific printer
- `POST /api/print` - Submit a print job

## Security Features

- Cloudinary URL validation
- Input sanitization
- CORS protection
- Secure file handling

## Usage in Kawach Web App

To integrate the print dialog in your Kawach web app:

```javascript
import PrintDialog from './components/PrintDialog';

// In your component:
const MyComponent = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const cloudinaryUrl = "your-cloudinary-url";

  return (
    <PrintDialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      cloudinaryUrl={cloudinaryUrl}
    />
  );
};
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
