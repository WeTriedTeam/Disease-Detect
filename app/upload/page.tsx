// app/upload/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    const patientName = "John Doe";
    const formData = new FormData();
    formData.append("image", image);
    formData.append("patient_firstname", "John");
    formData.append("patient_lastname", "Doe");

    //  API call to upload image for processing
    try {
      const res = await fetch("http://localhost:3001/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();

        // Use the path from the server response to create the image URL
        const imageUrl = `http://localhost:3001${data.path}`;

        setProcessedImage(imageUrl); // Set the image URL in state
        console.log(res);
      } else {
        console.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Image for Object Detection</h1>
      <form onSubmit={handleSubmit}>
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload"}
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
