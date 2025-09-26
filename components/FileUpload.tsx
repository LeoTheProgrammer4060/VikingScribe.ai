
import React from 'react';

const UploadIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const AudioFileIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 mr-2 text-indigo-400"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 6l12-3" />
    </svg>
);


interface FileUploadProps {
  onFileChange: (file: File | null) => void;
  selectedFile: File | null;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange, selectedFile, disabled }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };
  
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    onFileChange(file);
  };

  const triggerFileSelect = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="w-full">
      <label 
        htmlFor="audio-upload"
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
        ${disabled ? 'bg-gray-800 border-gray-700 cursor-not-allowed' : 'bg-gray-700/50 border-gray-600 hover:border-indigo-500 hover:bg-gray-700'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400"/>
            <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">MP3, WAV, M4A, FLAC, etc.</p>
        </div>
        <input 
            id="audio-upload" 
            ref={fileInputRef}
            type="file" 
            accept="audio/*"
            className="hidden" 
            onChange={handleFileChange}
            disabled={disabled}
        />
      </label>
      {selectedFile && (
        <div className="mt-4 p-3 bg-gray-700/50 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <AudioFileIcon />
            <span className="text-sm text-gray-300">{selectedFile.name}</span>
          </div>
          <button 
            onClick={() => onFileChange(null)} 
            className="text-gray-400 hover:text-white"
            disabled={disabled}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
