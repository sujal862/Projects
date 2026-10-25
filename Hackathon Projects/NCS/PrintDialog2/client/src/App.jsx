import React, { useState } from 'react';
import PrintDialog from './components/PrintDialog';
import { Button } from '@mui/material';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // This would normally come from your Kawach web app
  const sampleCloudinaryUrl = "https://res.cloudinary.com/demo/image/upload/sample.pdf";

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Print Dialog Demo</h1>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => setDialogOpen(true)}
        >
          Open Print Dialog
        </Button>

        <PrintDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          cloudinaryUrl={sampleCloudinaryUrl}
        />
      </div>
    </div>
  );
}

export default App;
