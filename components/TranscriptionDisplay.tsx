
import React, { useState, useEffect } from 'react';

interface TranscriptionDisplayProps {
  text: string;
  isLoading: boolean;
}

const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ text, isLoading }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
      if(copied) {
          const timer = setTimeout(() => setCopied(false), 2000);
          return () => clearTimeout(timer);
      }
  }, [copied]);
  
  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
    }
  };

  const hasText = text && text.length > 0;

  return (
    <div className="w-full mt-4">
      <div className="relative w-full h-80 bg-gray-800/50 border border-gray-700 rounded-lg shadow-inner">
        <textarea
          readOnly
          value={text}
          placeholder={isLoading ? "Transcription in progress..." : "Your transcribed text will appear here..."}
          className="w-full h-full p-4 bg-transparent text-gray-300 placeholder-gray-500 resize-none focus:outline-none rounded-lg"
        />
        {hasText && (
             <button
             onClick={handleCopy}
             className="absolute top-3 right-3 p-2 rounded-md bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white transition-all duration-200"
             aria-label="Copy to clipboard"
           >
            {copied ? <CheckIcon className="h-5 w-5 text-green-400" /> : <ClipboardIcon className="h-5 w-5" />}
           </button>
        )}
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
