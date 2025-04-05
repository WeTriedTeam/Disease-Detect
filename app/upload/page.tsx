// app/upload/page.tsx
'use client';

import { SetStateAction, useCallback, useState, useRef, ButtonHTMLAttributes, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Dropzone from '@/components/ui/dropzone';
import { Dialog,DialogContent,DialogTitle,DialogTrigger,DialogDescription, DialogHeader, DialogFooter  } from "@/components/ui/dialog";
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';


export default function UploadImage() {
  const [images, setImages] = useState<File[] | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [diagnosis_id, setDiagnosisId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUploadStatus, setShowUploadStatus] = useState(false);



  const handleDrop = (acceptedFiles: File[]) => {
    setImages(acceptedFiles);
  };

  const router = useRouter();
  
  useEffect(() => {
    if (diagnosis_id !== null) {

    }
  }, [diagnosis_id]);

  return (
    <div className="max-w-2xl mx-auto p-6">
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-gray-900">Abnormalities Detection Upload</h1>
      <p className="mt-2 text-gray-600">Upload medical images for automated object detection</p>
    </div>

    <form 
      className="space-y-6 bg-white p-6 rounded-lg shadow-sm border"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowUploadStatus(true);

        try {
          const formData = new FormData();
          formData.append('patient_id', e.currentTarget.patient_id.value);

          images?.forEach((file) => {
            formData.append('files', file);
          })
          

          console.log(images, 'images');
          
          if (!images || images.length === 0) {
            setLoading(false);
            throw new Error('Please select at least one file');
          }

          // if(files.length > 1){
                try {
                  setLoading(true);

                  const res = await fetch(`http://127.0.0.1:8000/upload?patient_id=${formData.get('patient_id')}`, {
                    method: 'POST',
                    body: formData,
                  });

                  if (!res.ok) {
                      throw new Error(`Error: ${res.status}`)
                  }
                  const data = await res.json();

                  const firstDiagnosis = data[0]; // Get the first diagnosis object
                  
                  setDiagnosisId(firstDiagnosis.diagnosis_id);

                  setTimeout(()=> {
                    router.push(`/view-diagnosis/${firstDiagnosis.diagnosis_id}`);
                  },1000)



                } catch (error) {
                  console.error('Error:', error);
                } finally {
                  setLoading(false);           
                }
          // }
          
 
         
          
        } catch (error) {
          alert(error instanceof Error ? error.message : 'Upload failed');
        }
      }}
    >
      <div className="space-y-2">
        <label 
          htmlFor="patient_id" 
          className="block text-sm font-medium text-gray-700"
        >
          Patient ID
        </label>
        <Input 
          type="string" 
          name="patient_id" 
          id="patient_id" 
          placeholder="Enter patient ID"
          className="w-full"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <Dropzone name="file" onChange={handleDrop}/>
      </div>

      <Button 
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </form>


    {loading ? (
      <Dialog open={loading}>
        <DialogContent className="flex flex-col items-center justify-center gap-4 p-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full shadow-lg animate-spin"></div>
          <p className="mt-4 text-gray-700 text-lg font-semibold">Loading...</p>
        </div>
        </DialogContent>
      </Dialog>
    ) : (
      <Dialog open={showUploadStatus} onOpenChange={setShowUploadStatus}>
        <DialogContent className="max-w-md p-6 flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Successfully Uploaded!!</DialogTitle>
            <DialogDescription className="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <linearGradient id="IMoH7gpu5un5Dx2vID39Ra_pIPl8tqh3igN_gr1" x1="9.858" x2="38.142" y1="9.858" y2="38.142" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#9dffce"></stop><stop offset="1" stop-color="#50d18d"></stop></linearGradient><path fill="url(#IMoH7gpu5un5Dx2vID39Ra_pIPl8tqh3igN_gr1)" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><linearGradient id="IMoH7gpu5un5Dx2vID39Rb_pIPl8tqh3igN_gr2" x1="13" x2="36" y1="24.793" y2="24.793" gradientUnits="userSpaceOnUse"><stop offset=".824" stop-color="#135d36"></stop><stop offset=".931" stop-color="#125933"></stop><stop offset="1" stop-color="#11522f"></stop></linearGradient><path fill="url(#IMoH7gpu5un5Dx2vID39Rb_pIPl8tqh3igN_gr2)" d="M21.293,32.707l-8-8c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414	c0.391-0.391,1.024-0.391,1.414,0L22,27.758l10.879-10.879c0.391-0.391,1.024-0.391,1.414,0l1.414,1.414	c0.391,0.391,0.391,1.024,0,1.414l-13,13C22.317,33.098,21.683,33.098,21.293,32.707z"></path>
              </svg>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => {setShowUploadStatus(false);                         
                      }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}


  </div>
  );
}
