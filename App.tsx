
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import LanguageSelector from './components/LanguageSelector';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import { SUPPORTED_LANGUAGES } from './constants';
import { transcribeAudio } from './services/geminiService';

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const App: React.FC = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<string>('en-US');
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleTranscribe = useCallback(async () => {
    if (!audioFile) {
      setError('Please select an audio file first.');
      return;
    }

    setIsLoading(true);
    setTranscription('');
    setError(null);

    try {
      const base64Audio = await fileToBase64(audioFile);
      const mimeType = audioFile.type;
      const selectedLanguageName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';

      const result = await transcribeAudio(base64Audio, mimeType, selectedLanguageName);
      setTranscription(result);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [audioFile, language]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                Transcribe Audio in Seconds
            </h1>
            <p className="mt-4 text-lg text-gray-400">
                Powered by Gemini, supporting 100+ languages with high accuracy.
            </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8 space-y-6 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg flex items-center"><span className="text-xs w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2">1</span> Upload Audio File</h3>
                    <FileUpload onFileChange={setAudioFile} selectedFile={audioFile} disabled={isLoading} />
                </div>
                <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg flex items-center"><span className="text-xs w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2">2</span> Select Language</h3>
                    <LanguageSelector 
                        languages={SUPPORTED_LANGUAGES} 
                        selectedLanguage={language} 
                        onLanguageChange={setLanguage}
                        disabled={isLoading}
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div>
                <button 
                    onClick={handleTranscribe}
                    disabled={!audioFile || isLoading}
                    className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 text-lg shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <Spinner />
                            <span>Transcribing...</span>
                        </>
                    ) : 'Start Transcription'}
                </button>
            </div>
          
            <div className="pt-4 border-t border-gray-700">
                <h3 className="font-semibold text-lg mb-2 flex items-center"><span className="text-xs w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2">3</span> Get Result</h3>
                <TranscriptionDisplay text={transcription} isLoading={isLoading} />
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;
