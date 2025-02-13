// app/upload/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UploadImage() {
  const [image, setImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', image);

    //  API call to upload image for processing
    try {
      const res = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
          throw new Error(`Error: ${res.status}`)
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      alert("Uploaded Successfully!")
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image for Object Detection</h1>
      <form onSubmit={handleSubmit}>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Upload'}
        </Button>
      </form>

      {processedImage && (
        <div className="mt-4">
          <h2>Processed Image:</h2>
          <img src={processedImage} alt="Processed" className="mt-2" />
        </div>
      )}
    </div>
  );
}
