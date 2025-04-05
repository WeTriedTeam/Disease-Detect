import { useRef } from "react";
import { useDropzone } from "react-dropzone";

export default function Dropzone(props: { name: string, onChange: (files: File[]) => void }) {
  // const { onChange } = props;
  const hiddenInputRef = useRef<any>(null);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
    onDrop: acceptedFiles => {
      if (hiddenInputRef.current) {
        const dataTransfer = new DataTransfer();
        acceptedFiles.forEach(file => dataTransfer.items.add(file));
        hiddenInputRef.current.files = dataTransfer.files;
        props.onChange(acceptedFiles); // Call the onChange prop with the accepted files
      }
    }
  });

  const files = acceptedFiles.map(file => (
    <li key={file.path} className="flex items-center gap-2 text-sm text-gray-600">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>{file.path}</span>
      <span className="text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
    </li>
  ));

  return (
    <div className="space-y-4">
    <div
      {...getRootProps()}
      className={`
        relative p-6 border-2 border-dashed rounded-lg transition-all duration-200
        ${isDragActive 
          ? 'border-blue-400 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
        }
      `}
    >
      <input 
        type="file" 
        name={props.name} 
        required={true} 
        className="hidden" 
        ref={hiddenInputRef}
      />
      <input {...getInputProps()} />
      
      <div className="text-center">
        <svg
          className={`mx-auto h-8 w-8 ${
            isDragActive ? 'text-blue-500' : 'text-gray-400'
          }`}
          stroke="currentColor"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        
        <div className="mt-3 text-sm">
          <p className={isDragActive ? 'text-blue-500 font-medium' : 'text-gray-600'}>
            {isDragActive ? 'Drop files' : 'Drop files or click to upload'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            JPG, JPEG, PNG
          </p>
        </div>
      </div>
    </div>

    {acceptedFiles.length > 0 && (
      <ul className="space-y-1 text-sm">
        {files}
      </ul>
    )}
  </div>
  );
}