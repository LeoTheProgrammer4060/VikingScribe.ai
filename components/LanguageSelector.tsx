
import React from 'react';
import type { Language } from '../types';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: string;
  onLanguageChange: (languageCode: string) => void;
  disabled: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selectedLanguage, onLanguageChange, disabled }) => {
  return (
    <div className="w-full">
      <select
        id="language"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={disabled}
        className="w-full bg-gray-700/50 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-gray-800 text-gray-200">
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSelector;
